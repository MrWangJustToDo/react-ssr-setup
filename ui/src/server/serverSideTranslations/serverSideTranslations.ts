// NOTE: this file can only used in the server side!

import { constants } from "fs";
import { access, readFile } from "fs/promises";
import { memoize, omit, pick } from "lodash";
import { resolve } from "path";

type SubKey = {
  [props: string]: string | SubKey | Array<string | SubKey>;
};

type AdvancedConfig = string | { [props: string]: string | SubKey | Array<string | SubKey> };

export type IncludeNameSpaceConfig =
  | string
  | {
      nameSpace: string;
      include?: AdvancedConfig[];
    };

export type ExcludeNameSpaceConfig =
  | string
  | {
      nameSpace: string;
      exclude?: AdvancedConfig[];
    };

export type NameSpaceConfig =
  | string
  | {
      nameSpace: string;
      include?: AdvancedConfig[];
      exclude?: AdvancedConfig[];
    };

type NameSpaceConfigOnlyObject = Exclude<NameSpaceConfig, string>;

// basePath of the i18n folder
const I18N_PATH = resolve(process.cwd(), "i18n");

const FALLBACK_LANG = "en";

const checkFileExist = async (lang: string, nameSpace: string) => {
  const nameSpacePath = resolve(I18N_PATH, lang, `${nameSpace}.json`);
  const enSpacePath = resolve(I18N_PATH, FALLBACK_LANG, `${nameSpace}.json`);
  try {
    await access(nameSpacePath, constants.F_OK);
    return nameSpacePath;
  } catch (e) {
    if (__DEVELOPMENT__) {
      console.warn(`file ${lang}/${nameSpace}.json not exist!`);
    }
    void 0;
  }

  if (nameSpacePath !== enSpacePath) {
    try {
      await access(enSpacePath, constants.F_OK);
      return enSpacePath;
    } catch (e) {
      if (__DEVELOPMENT__) {
        console.error(`fallback file ${FALLBACK_LANG}/${nameSpace}.json not exist!`);
      }
      void 0;
    }
  }
};

const memoizeCheckFileExist = __DEVELOPMENT__ ? checkFileExist : memoize(checkFileExist, (lang, nameSpace) => `${lang}/${nameSpace}`);

const getJSONFileContent = async (absolutePath: string) => {
  const content = await readFile(absolutePath, { encoding: "utf-8" });
  return JSON.parse(content);
};

const memoizeGetJSONFileContent = __DEVELOPMENT__ ? getJSONFileContent : memoize(getJSONFileContent);

const getI18nFileContent = async (lang: string, nameSpaces: string[]) => {
  return Promise.all(
    nameSpaces.map(async (nameSpace) => {
      const absolutePath = await memoizeCheckFileExist(lang, nameSpace);
      if (absolutePath) {
        const content = await memoizeGetJSONFileContent(absolutePath);
        return { [nameSpace]: content };
      } else {
        return { [nameSpace]: {} };
      }
    })
  );
};

const modifyObjectByConfig = (
  nameSpaceStore: { [props: string]: unknown },
  excludeOrIncludeConfigArray: AdvancedConfig[],
  actionType: "include" | "exclude",
  recursive = 0
) => {
  if (excludeOrIncludeConfigArray.length === 0) return nameSpaceStore;

  const currentConfigArray: string[] = [];
  const nextConfigArray: Exclude<AdvancedConfig, string>[] = [];

  excludeOrIncludeConfigArray.forEach((config) => {
    if (typeof config === "string") {
      currentConfigArray.push(config);
    } else {
      nextConfigArray.push(config);
    }
  });

  const action = actionType === "include" ? pick : omit;

  const modifiedNameSpaceStore = action(nameSpaceStore, currentConfigArray);

  nextConfigArray.forEach((config) => {
    const typedConfig = config as Exclude<AdvancedConfig, string>;
    const configKeys = Object.keys(typedConfig);
    configKeys.forEach((key) => {
      if (!nameSpaceStore[key]) {
        if (__DEVELOPMENT__) {
          console.error(`current exclude key:${key} not exist in the nameSpace content --> (${recursive}) times recursive call`);
        }
      } else {
        modifiedNameSpaceStore[key] = modifyObjectByConfig(
          nameSpaceStore[key] as Record<string, unknown>,
          Array.isArray(config[key]) ? (config[key] as AdvancedConfig[]) : ([config[key]] as AdvancedConfig[]),
          actionType,
          recursive + 1
        );
      }
    });
  });

  return modifiedNameSpaceStore;
};

export const modifyI18nStore = (
  originalI18nStore: {
    [nameSpace: string]: unknown;
  },
  excludesAndInCludes: NameSpaceConfigOnlyObject[]
) => {
  const re: Record<string, unknown> = {};
  const allNameSpace = Object.keys(originalI18nStore);
  allNameSpace.forEach((nameSpace) => {
    const targetExcludesOrInCludes = excludesAndInCludes.find((config) => config.nameSpace === nameSpace);
    if (targetExcludesOrInCludes) {
      const excludeConfigArray = targetExcludesOrInCludes["exclude"];
      const includeConfigArray = targetExcludesOrInCludes["include"];
      if (__DEVELOPMENT__) {
        if (excludeConfigArray?.length && includeConfigArray?.length) {
          console.error("nameSpace config only accept include/exclude field");
        }
        if (excludeConfigArray) {
          excludeConfigArray.reduce<Record<string, unknown>>((p, c) => {
            if (typeof c === "string" && p[c]) {
              console.error(`found duplicate exclude key: ${c} !`);
            }
            if (typeof c === "object" && Object.keys(c).some((k) => p[k])) {
              console.error(`found duplicate exclude key in the config object, key: ${Object.keys(c).find((k) => p[k])}`);
            }
            return { ...p, ...(typeof c === "string" ? { [c]: true } : c) };
          }, {});
        }
        if (includeConfigArray) {
          includeConfigArray.reduce<Record<string, unknown>>((p, c) => {
            if (typeof c === "string" && p[c]) {
              console.error(`found duplicate include key: ${c} !`);
            }
            if (typeof c === "object" && Object.keys(c).some((k) => p[k])) {
              console.error(`found duplicate include key in the config object, key: ${Object.keys(c).find((k) => p[k])}`);
            }
            return { ...p, ...(typeof c === "string" ? { [c]: true } : c) };
          }, {});
        }
      }
      if (excludeConfigArray) {
        re[nameSpace] = modifyObjectByConfig(originalI18nStore[nameSpace] as Record<string, unknown>, excludeConfigArray, "exclude");
      }
      if (includeConfigArray) {
        re[nameSpace] = modifyObjectByConfig(originalI18nStore[nameSpace] as Record<string, unknown>, includeConfigArray, "include");
      }
    } else {
      re[nameSpace] = originalI18nStore[nameSpace];
    }
  });

  return re;
};

export async function serverSideTranslations(
  lang: string,
  nameSpaceConfigs: IncludeNameSpaceConfig[]
): Promise<{
  _i18nMessage: Record<string, unknown>;
}>;
export async function serverSideTranslations(
  lang: string,
  nameSpaceConfigs: ExcludeNameSpaceConfig[]
): Promise<{
  _i18nMessage: Record<string, unknown>;
}>;
export async function serverSideTranslations(lang: string, nameSpaceConfigs: NameSpaceConfig[]) {
  const originalNameSpace = nameSpaceConfigs
    .map((name) => {
      if (typeof name === "string") {
        return name;
      } else {
        return name.nameSpace;
      }
    })
    .map((nameSpace) => {
      if (nameSpace.endsWith(".json")) {
        if (__DEVELOPMENT__) {
          console.warn("can not add .json for nameSpace field");
        }
        return nameSpace.slice(0, -5);
      }
      return nameSpace;
    });

  if (__DEVELOPMENT__) {
    originalNameSpace.reduce<Record<string, boolean>>((p, c) => {
      if (p[c]) {
        console.error(`found duplicate nameSpace ${c}`);
      }
      return {
        ...p,
        [c]: true,
      };
    }, {});
  }

  const originalI18nStoreArray = await getI18nFileContent(lang, originalNameSpace);

  const originalI18nStore = originalI18nStoreArray.reduce<Record<string, unknown>>((p, c) => ({ ...p, ...c }), {});

  const excludesOrIncludes = nameSpaceConfigs
    ? nameSpaceConfigs
        .map<NameSpaceConfigOnlyObject>((name) => (typeof name === "string" ? { nameSpace: name } : name))
        .filter((it) => it["exclude"] || it["include"])
    : [];

  const modifiedI18nStore = !excludesOrIncludes.length ? originalI18nStore : modifyI18nStore(originalI18nStore, excludesOrIncludes);

  return {
    _i18nMessage: modifiedI18nStore,
  } as const;
}
