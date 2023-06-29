/* eslint-disable @typescript-eslint/no-var-requires */
import { getIsAnimateRouter, getIsMiddleware, getIsStaticGenerate } from "@shared";

import { composeRender } from "./compose";
import { generateGlobalEnv, initLang, initStore, loadAsset, loadLang, loadStore } from "./middleware";

export const renderSSR = composeRender(
  generateGlobalEnv({
    isSSR: true,
    isSTATIC: getIsStaticGenerate(),
    isPURE_CSR: false,
    isMIDDLEWARE: __VITE__ ? true : getIsMiddleware(),
    isDEVELOPMENT: __DEVELOPMENT__,
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST,
  }),
  initLang,
  initStore,
  loadStore,
  loadLang,
  loadAsset
)(async (args) => {
  if (__VITE__) {
    const { viteRender } = require("./render/viteRender");
    const targetRender = viteRender({ mode: "SSR" });
    await targetRender(args);
  } else {
    const { webpackRender } = require("./render/webpackRender");
    const targetRender = webpackRender({ mode: "SSR" });
    await targetRender(args);
  }
});

export const renderCSR = composeRender(
  generateGlobalEnv({
    isSSR: false,
    isSTATIC: false,
    isPURE_CSR: false,
    isDEVELOPMENT: __DEVELOPMENT__,
    isMIDDLEWARE: __VITE__ ? true : getIsMiddleware(),
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST,
  }),
  initLang,
  initStore,
  loadStore,
  loadLang,
  loadAsset
)(async (args) => {
  if (__VITE__) {
    const { viteRender } = require("./render/viteRender");
    const targetRender = viteRender({ mode: "CSR" });
    await targetRender(args);
  } else {
    const { webpackRender } = require("./render/webpackRender");
    const targetRender = webpackRender({ mode: "CSR" });
    await targetRender(args);
  }
});

export const renderP_CSR = composeRender(
  generateGlobalEnv({
    isSSR: false,
    isSTATIC: false,
    isPURE_CSR: true,
    isMIDDLEWARE: __VITE__ ? true : getIsMiddleware(),
    isDEVELOPMENT: __DEVELOPMENT__,
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST,
  }),
  initLang,
  loadAsset
)(async (args) => {
  if (__VITE__) {
    const { viteRender } = require("./render/viteRender");
    const targetRender = viteRender({ mode: "P_CSR" });
    await targetRender(args);
  } else {
    const { webpackRender } = require("./render/webpackRender");
    const targetRender = webpackRender({ mode: "P_CSR" });
    await targetRender(args);
  }
});
