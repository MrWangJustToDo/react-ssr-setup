import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { Provider } from "react-redux";
import { hydrate, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { loadableReady } from "@loadable/component";

import { log } from "utils/log";
import { sagaStore } from "store";
import { StoreState } from "types/store";
import { App } from "components/App";
import { theme } from "config/theme";
import { createEmotionCache } from "config/createEmotionCache";

const cache = createEmotionCache();

const place = document.querySelector("#content");

const store = sagaStore({ initialState: window.__PRELOADED_STATE__ as StoreState });

const content = (
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <HelmetProvider>
            <React.StrictMode>
              <CssBaseline />
              <App />
            </React.StrictMode>
          </HelmetProvider>
        </Router>
      </Provider>
    </ThemeProvider>
  </CacheProvider>
);

loadableReady(() =>
  (__DEVELOPMENT__ && __MIDDLEWARE__) || !__SSR__ ? (log("not hydrate render on client", "warn"), render(content, place)) : hydrate(content, place)
);
