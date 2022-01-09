/* eslint-disable @typescript-eslint/no-var-requires */
import { ServerError } from "server/utils/error";
import { AnyAction, composeRender } from "../compose";
import { globalEnv, initLang, initStore, loadLang, loadStore } from "../middleware";

const targetRender: AnyAction = async ({ req, res, store, lang, env, serverSideProps = {} }) => {
  if (!store || !lang || !env) {
    throw new ServerError("初始化失败", 500);
  } else {
    if (__UI__ === "antd") {
      const { targetRender } = require("./renderAntDesign");
      return targetRender({ req, res, store, lang, env, serverSideProps });
    }
    if (__UI__ === "material") {
      const { targetRender } = require("./renderMaterial");
      return targetRender({ req, res, store, lang, env, serverSideProps });
    }
    if (__UI__ === "chakra") {
      const { targetRender } = require("./renderChakra");
      return targetRender({ req, res, store, lang, env, serverSideProps });
    }
  }
};

export const renderSSR = composeRender(globalEnv, initLang, initStore, loadStore, loadLang)(targetRender);
