import React from "react";
import { hydrate, render } from "react-dom";
import { loadableReady } from "@loadable/component";

import { createUniversalStore } from "store";
import { log } from "utils/log";
import { safeData } from "utils/safeData";
import { StoreState } from "types/store";
import { Root as AntRoot } from "./antDesignEntry";
import { Root as ChakraRoot } from "./chakraEntry";
import { Root as MaterialRoot } from "./materialEntry";

const place = document.querySelector("#__content__");

const preLoadEnvElement = document.querySelector("script#__preload_env__");

const preLoadStateElement = document.querySelector("script#__preload_state__");

const store = createUniversalStore({ initialState: JSON.parse(preLoadStateElement?.innerHTML || "") as StoreState });

window.__ENV__ = safeData(JSON.parse(preLoadEnvElement?.innerHTML || "{}"));

safeData(window as unknown as Record<string, unknown>, "__ENV__");

const Root = window.__ENV__.UI === "material" ? MaterialRoot : window.__ENV__.UI === "antd" ? AntRoot : ChakraRoot;

if (!window.__ENV__.SSR) {
  loadableReady(() => render(<Root store={store} />, place));
} else {
  loadableReady(() =>
    __DEVELOPMENT__ && __MIDDLEWARE__
      ? (log("not hydrate render on client", "warn"), render(<Root store={store} />, place))
      : hydrate(<Root store={store} />, place)
  );
}
