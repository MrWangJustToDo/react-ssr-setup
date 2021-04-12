import React from "react";
import { hydrate } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { loadableReady } from "@loadable/component";

import { allRoutes } from "router/routes";
import App from "components/App";
import LoadingBar from "components/LoadingBar";
import WraperRoute from "components/WraperRoute";
import { configureStore } from "share/store/store";

const store = configureStore({ initialState: window.__PRELOADED_STATE__ });

const place = document.querySelector("#app");

const content = (
  <Provider store={store}>
    <Router>
      <HelmetProvider>
        <WraperRoute routes={allRoutes} LoadingBar={LoadingBar}>
          <App />
        </WraperRoute>
      </HelmetProvider>
    </Router>
  </Provider>
);

loadableReady(() => hydrate(content, place));
