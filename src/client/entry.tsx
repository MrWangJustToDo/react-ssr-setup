/* eslint-disable @typescript-eslint/no-var-requires */
import { hydrate, render } from "react-dom";
import { loadableReady } from "@loadable/component";

import { createUniversalStore } from "store";
import { allRoutes } from "router/routes";
import { log } from "utils/log";
import { safeData } from "utils/safeData";
import { preLoad, preLoadLang } from "utils/preLoad";
import { StoreState } from "types/store";

const place = document.querySelector("#__content__");

const preLoadEnvElement = document.querySelector("script#__preload_env__");

const preLoadPropsElement = document.querySelector("script#__preload_props__");

const preLoadStateElement = document.querySelector("script#__preload_state__");

const store = createUniversalStore({ initialState: JSON.parse(preLoadStateElement?.innerHTML || "{}") as StoreState });

window.__ENV__ = JSON.parse(preLoadEnvElement?.innerHTML || "{}");

window.__INITIAL_PROPS_SSR__ = JSON.parse(preLoadPropsElement?.innerHTML || "{}");

safeData(window.__ENV__);

safeData(window as unknown as Record<string, unknown>, "__ENV__");

safeData(window.__INITIAL_PROPS_SSR__);

safeData(window as unknown as Record<string, unknown>, "__INITIAL_PROPS_SSR__");

document.querySelector("script#__autoInject__")?.remove();

let Root = ({ store: _store }: { store: ReturnType<typeof createUniversalStore> }) => <></>;

// multiple UI component
if (__UI__ === "antd") {
  const { Root: originalRoot } = require("./antDesignEntry");
  Root = originalRoot;
}
if (__UI__ === "chakra") {
  const { Root: originalRoot } = require("./chakraEntry");
  Root = originalRoot;
}
if (__UI__ === "material") {
  const { Root: originalRoot } = require("./materialEntry");
  Root = originalRoot;
}

if (__CSR__) {
  log("pure render by client", "warn");
  Promise.all([preLoadLang({ store, lang: window.__ENV__.LANG }), preLoad(allRoutes, location.pathname, store)]).then(() =>
    loadableReady(() => render(<Root store={store} />, place))
  );
} else {
  if (!window.__ENV__.isSSR) {
    loadableReady(() => render(<Root store={store} />, place));
  } else {
    if (window.__ENV__.isDEVELOPMENT && window.__ENV__.isMIDDLEWARE) {
      log("not hydrate render on client", "warn");
      loadableReady(() => render(<Root store={store} />, place));
    } else {
      loadableReady(() => hydrate(<Root store={store} />, place));
    }
  }
}
