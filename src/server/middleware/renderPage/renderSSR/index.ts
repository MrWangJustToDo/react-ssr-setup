import { ServerError } from "server/utils/error";

import { composeRender } from "../compose";
import { globalEnv, initLang, initStore, loadCookie, loadLang, loadStore } from "../middleware";

import { targetRender as ChakraTargetRender } from "./renderChakra";

import type { AnyAction } from "../compose";

const targetRender: AnyAction = async ({ req, res, store, lang, env, page }) => {
  if (!store || !lang || !env || !page) {
    throw new ServerError("初始化失败", 500);
  } else {
    return ChakraTargetRender({ req, res, store, lang, env, page });
  }
};

export const renderSSR = composeRender(globalEnv, initLang, initStore, loadStore, loadLang, loadCookie)(targetRender);
