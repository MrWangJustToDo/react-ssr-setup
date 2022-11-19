import fs from "fs/promises";
import { memoize } from "lodash";
import path from "path";

const outputPath = (env: "server" | "client"): string => (__DEVELOPMENT__ ? path.resolve(process.cwd(), "dev", env) : path.resolve(process.cwd(), "dist", env));

const manifestFile = (): string => (__DEVELOPMENT__ ? "manifest-dev-vite.json" : "manifest-prod-vite.json");

const manifestStateFile = (env: "server" | "client"): string => path.resolve(outputPath(env), manifestFile());

const _getAllStateFileContent = async <T = Record<string, string>, P = T>(path: string, normalize: (content: T) => P | T = (s) => s): Promise<P> => {
  const content = await fs.readFile(path, { encoding: "utf-8" }).then((c) => JSON.parse(c));
  return normalize(content) as P;
};

const getAllStateFileContent = __DEVELOPMENT__
  ? _getAllStateFileContent
  : memoize(_getAllStateFileContent, (path, normalize) => `${path}/${(normalize || "empty").toString()}`);

const mainStylesPath = (content: Record<string, any>): string[] => {
  const key = Object.keys(content).find((key) => content[key].isEntry);
  return content[key]?.["css"] || [];
};

const mainScriptsPath = (content: Record<string, any>): { path: string }[] => {
  const key = Object.keys(content).find((key) => content[key].isEntry);
  const paths = [];
  if (content[key]) {
    paths.push(...content[key]["imports"].map((key) => content[key]["file"]));
    paths.push(content[key]["file"]);
  }
  return paths.map((path) => ({ type: "module", path }));
};

export { manifestStateFile, getAllStateFileContent, mainStylesPath, mainScriptsPath };
