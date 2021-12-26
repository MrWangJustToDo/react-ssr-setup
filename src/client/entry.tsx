/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";
import { hydrate, render } from "react-dom";
import { loadableReady } from "@loadable/component";

import { createUniversalStore } from "store";
import { log } from "utils/log";
import { safeData } from "utils/safeData";
import { StoreState } from "types/store";

const place = document.querySelector("#__content__");

const preLoadEnvElement = document.querySelector("script#__preload_env__");

const preLoadStateElement = document.querySelector("script#__preload_state__");

const store = createUniversalStore({ initialState: JSON.parse(preLoadStateElement?.innerHTML || "{}") as StoreState });

window.__ENV__ = safeData(JSON.parse(preLoadEnvElement?.innerHTML || "{}"));

safeData(window as unknown as Record<string, unknown>, "__ENV__");

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

if (!window.__ENV__.SSR) {
  loadableReady(() => render(<Root store={store} />, place));
} else {
  if (__DEVELOPMENT__ && __MIDDLEWARE__) {
    log("not hydrate render on client", "warn");
    loadableReady(() => render(<Root store={store} />, place));
  } else {
    loadableReady(() => hydrate(<Root store={store} />, place));
  }
}
