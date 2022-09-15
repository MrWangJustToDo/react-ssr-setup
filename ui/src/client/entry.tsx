/* eslint-disable @typescript-eslint/no-var-requires */
import { createRoot, hydrateRoot } from "react-dom/client";

import { createUniversalStore, safeData } from "@shared";

import { Root } from "./app";

import type { RootState } from "@shared";

const place = document.querySelector("#__content__") as HTMLDivElement;

const preLoadEnvElement = document.querySelector("script#__preload_env__");

const preLoadStateElement = document.querySelector("script#__preload_state__");

const store = createUniversalStore({
  preloadedState: JSON.parse(preLoadStateElement?.innerHTML || "{}") as RootState,
});

window.__ENV__ = JSON.parse(preLoadEnvElement?.innerHTML || "{}");

window.__PRELOAD_STORE_STATE__ = JSON.parse(preLoadStateElement?.innerHTML || "{}");

safeData(window.__ENV__);

safeData(window as unknown as Record<string, unknown>, "__ENV__");

safeData(window.__PRELOAD_STORE_STATE__);

safeData(window as unknown as Record<string, unknown>, "__PRELOAD_STORE_STATE__");

if (window.__ENV__.isPURE_CSR) {
  const { loadCurrentLang } = require("@shared");
  const root = createRoot(place);
  loadCurrentLang(store.dispatch, window.__ENV__.LANG as "en" | "ar").then(() => root.render(<Root store={store} />));
} else {
  if (!window.__ENV__.isSSR || (window.__ENV__.isDEVELOPMENT && window.__ENV__.isMIDDLEWARE)) {
    const root = createRoot(place);
    root.render(<Root store={store} />);
  } else {
    hydrateRoot(place, <Root store={store} />);
  }
}
