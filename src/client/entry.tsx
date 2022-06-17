/* eslint-disable @typescript-eslint/no-var-requires */
import { createRoot, hydrateRoot } from "react-dom/client";

import { createUniversalStore } from "store";
import { log } from "utils/log";
import { safeData } from "utils/safeData";

import { Root } from "./chakraEntry";

import type { StoreState } from "types/store";

const place = document.querySelector("#__content__") as HTMLDivElement;

const preLoadEnvElement = document.querySelector("script#__preload_env__");

const preLoadStateElement = document.querySelector("script#__preload_state__");

const store = createUniversalStore({ initialState: JSON.parse(preLoadStateElement?.innerHTML || "{}") as StoreState });

window.__ENV__ = JSON.parse(preLoadEnvElement?.innerHTML || "{}");

window.__PRELOAD_STORE_STATE__ = JSON.parse(preLoadStateElement?.innerHTML || "{}");

safeData(window.__ENV__);

safeData(window as unknown as Record<string, unknown>, "__ENV__");

safeData(window.__PRELOAD_STORE_STATE__);

safeData(window as unknown as Record<string, unknown>, "__PRELOAD_STORE_STATE__");

if (__CSR__) {
  log("pure render by client", "warn");
  const { preLoadLang } = require("utils/preLoad");
  const root = createRoot(place);
  preLoadLang({ store, lang: window.__ENV__.LANG }).then(() => root.render(<Root store={store} />));
} else {
  if (!window.__ENV__.isSSR || (window.__ENV__.isDEVELOPMENT && window.__ENV__.isMIDDLEWARE)) {
    log("not hydrate render on client", "warn");
    const root = createRoot(place);
    root.render(<Root store={store} />);
  } else {
    hydrateRoot(place, <Root store={store} />);
  }
}
