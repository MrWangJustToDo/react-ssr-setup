import { CacheProvider, ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import { App } from "components/App";
import { createEmotionCache } from "config/createEmotionCache";
import { theme } from "config/materialTheme";

import type { createUniversalStore } from "store";

const cache = createEmotionCache();

const Root = ({ store }: { store: ReturnType<typeof createUniversalStore> }) => {
  console.warn("you are using Material UI component library!");

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

export { Root };
