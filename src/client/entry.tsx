import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { Provider } from "react-redux";
import { hydrate, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { loadableReady } from "@loadable/component";

import { createUniversalStore } from "store";
import { App } from "components/App";
import { log } from "utils/log";
import { preLoadLang } from "utils/preLoad";
import { theme } from "config/theme";
import { createEmotionCache } from "config/createEmotionCache";
import { StoreState } from "types/store";

const cache = createEmotionCache();

const place = document.querySelector("#content");

const store = createUniversalStore({ initialState: window.__PRELOADED_STATE__ as StoreState });

const { PUBLIC_API_HOST, ANIMATE_ROUTER } = window.__ENV__ as { PUBLIC_API_HOST: string; ANIMATE_ROUTER: boolean };

window.ANIMATE_ROUTER = ANIMATE_ROUTER;
window.PUBLIC_API_HOST = PUBLIC_API_HOST;

const Root = () => {
  return (
    <React.StrictMode>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Router>
              <HelmetProvider>
                <CssBaseline />
                <App />
              </HelmetProvider>
            </Router>
          </Provider>
        </ThemeProvider>
      </CacheProvider>
    </React.StrictMode>
  );
};

if (!__SSR__) {
  Promise.all([preLoadLang({ store, lang: window.__LANG__ as string }), loadableReady()]).then(() => render(<Root />, place));
} else {
  loadableReady(() => (__DEVELOPMENT__ && __MIDDLEWARE__ ? (log("not hydrate render on client", "warn"), render(<Root />, place)) : hydrate(<Root />, place)));
}
