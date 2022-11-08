import { getIsAnimateRouter, getIsMiddleware, getIsStaticGenerate } from "@shared";

import { composeRender } from "../compose";
import { generateGlobalEnv, initLang, initStore, loadAsset, loadLang, loadStore } from "../middleware";

import { targetRender as targetCSRRender } from "./renderCSR";
import { targetRender as targetP_CSRRender } from "./renderP_CSR";
import { targetRender as targetSSRRender } from "./renderSSR";
import { viteRender } from "./viteRender";

export const webpackRenderSSR = composeRender(
  generateGlobalEnv({
    isSSR: true,
    isSTATIC: getIsStaticGenerate(),
    isPURE_CSR: false,
    isMIDDLEWARE: getIsMiddleware(),
    isDEVELOPMENT: __DEVELOPMENT__,
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST,
  }),
  initLang,
  initStore,
  loadStore,
  loadLang,
  loadAsset
)(targetSSRRender);

export const webpackRenderCSR = composeRender(
  generateGlobalEnv({
    isSSR: false,
    isSTATIC: false,
    isPURE_CSR: false,
    isDEVELOPMENT: __DEVELOPMENT__,
    isMIDDLEWARE: getIsMiddleware(),
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST,
  }),
  initLang,
  initStore,
  loadStore,
  loadLang,
  loadAsset
)(targetCSRRender);

export const webpackRenderP_CSR = composeRender(
  generateGlobalEnv({
    isSSR: false,
    isSTATIC: false,
    isPURE_CSR: true,
    isMIDDLEWARE: getIsMiddleware(),
    isDEVELOPMENT: __DEVELOPMENT__,
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST,
  }),
  initLang,
  loadAsset
)(targetP_CSRRender);

export const viteRenderSSR = composeRender(
  generateGlobalEnv({
    isSSR: true,
    isSTATIC: getIsStaticGenerate(),
    isPURE_CSR: false,
    isMIDDLEWARE: getIsMiddleware(),
    isDEVELOPMENT: __DEVELOPMENT__,
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST,
  }),
  initLang,
  initStore,
  loadStore,
  loadLang
)(viteRender({ mode: "SSR" }));

export const viteRenderCSR = composeRender(
  generateGlobalEnv({
    isSSR: true,
    isSTATIC: getIsStaticGenerate(),
    isPURE_CSR: false,
    isMIDDLEWARE: getIsMiddleware(),
    isDEVELOPMENT: __DEVELOPMENT__,
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST,
  }),
  initLang,
  initStore,
  loadStore,
  loadLang
)(viteRender({ mode: "CSR" }));

export const viteRenderP_CSR = composeRender(
  generateGlobalEnv({
    isSSR: false,
    isSTATIC: false,
    isPURE_CSR: true,
    isMIDDLEWARE: getIsMiddleware(),
    isDEVELOPMENT: __DEVELOPMENT__,
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST,
  }),
  initLang,
  loadAsset
)(viteRender({ mode: "P_CSR" }));
