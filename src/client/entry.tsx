import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { Provider } from "react-redux";
import { hydrate, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { loadableReady } from "@loadable/component";

import { defaultLang } from "i18n";
import { sagaStore } from "store";
import { App } from "components/App";
import { log } from "utils/log";
import { preLoadLang } from "utils/preLoad";
import { theme } from "config/theme";
import { createEmotionCache } from "config/createEmotionCache";
import { StoreState } from "types/store";

const cache = createEmotionCache();

const place = document.querySelector("#content");

const store = sagaStore({ initialState: window.__PRELOADED_STATE__ as StoreState });

const Root = () => {
  return (
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
};

if (!__SSR__) {
  preLoadLang({ store, lang: defaultLang })
    .then(() => loadableReady())
    .then(() => render(<Root />, place));
} else {
  loadableReady(() => (__DEVELOPMENT__ && __MIDDLEWARE__ ? (log("not hydrate render on client", "warn"), render(<Root />, place)) : hydrate(<Root />, place)));
}
