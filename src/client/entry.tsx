import React from "react";
import { hydrate, render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { loadableReady } from "@loadable/component";

import { allRoutes } from "router/routes";
import App from "components/App";
import LoadingBar from "components/LoadingBar";
import WraperRoute from "components/WraperRoute";
import { sagaStore as getStore } from "share/store/store";
import { log } from "share/utils/log";

const store = getStore({ initialState: window.__PRELOADED_STATE__ });

const place = document.querySelector("#app");

const content = (
  <Provider store={store}>
    <Router>
      <HelmetProvider>
        <WraperRoute routes={allRoutes} LoadingBar={LoadingBar} animationRouter={__ANIMATEROUTER__}>
          <App />
        </WraperRoute>
      </HelmetProvider>
    </Router>
  </Provider>
);

loadableReady(() =>
  (__DEVELOPMENT__ && __MIDDLEWARE__) || !__SSR__ ? (log("not hydrate render on client", "warn"), render(content, place)) : hydrate(content, place)
);
