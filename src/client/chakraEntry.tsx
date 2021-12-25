import React from "react";
import { CacheProvider } from "@emotion/react";
import { ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import { App } from "components/App";
import { createEmotionCache } from "config/createEmotionCache";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { createUniversalStore } from "store";

const cache = createEmotionCache();

const Root = ({ store }: { store: ReturnType<typeof createUniversalStore> }) => {
  console.warn("you are using chakra UI component library!");

  return (
    // <React.StrictMode> for chakra UI always have id not match issue on the develop mode
    <CacheProvider value={cache}>
      <ChakraProvider resetCSS>
        <Provider store={store}>
          <Router>
            <HelmetProvider>
              <ColorModeScript />
              <App />
            </HelmetProvider>
          </Router>
        </Provider>
      </ChakraProvider>
    </CacheProvider>
    // </React.StrictMode>
  );
};

export { Root };
