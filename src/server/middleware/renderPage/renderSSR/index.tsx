import { ServerError } from "server/utils/error";
import { AnyAction, composeRender } from "../compose";
import { globalEnv, initLang, initStore, loadLang, loadStore } from "../middleware";
import { targetRender as antDesignRender } from "./renderAntDesign";
import { targetRender as materialRender } from "./renderMaterial";

const targetRender: AnyAction = async ({ req, res, store, lang, env }) => {
  if (!store || !lang || !env) {
    throw new ServerError("初始化失败", 500);
  } else {
    if (env.UI === "antd") {
      return antDesignRender({ req, res, store, lang, env });
    } else {
      return materialRender({ req, res, store, lang, env });
    }
  }
};

export const renderSSR = composeRender(globalEnv, initLang, initStore, loadStore, loadLang)(targetRender);
