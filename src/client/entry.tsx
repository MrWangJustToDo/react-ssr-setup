import React from "react";
import { Provider } from "react-redux";
import { hydrate, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { loadableReady } from "@loadable/component";
import { log } from "utils/log";
import { sagaStore } from "store";
import { StoreState } from "types/store";
import { App } from "components/App";

const place = document.querySelector("#content");

const store = sagaStore({ initialState: window.__PRELOADED_STATE__ as StoreState });

const content = (
  <Provider store={store}>
    <Router>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Router>
  </Provider>
);

loadableReady(() =>
  (__DEVELOPMENT__ && __MIDDLEWARE__) || !__SSR__ ? (log("not hydrate render on client", "warn"), render(content, place)) : hydrate(content, place)
);
