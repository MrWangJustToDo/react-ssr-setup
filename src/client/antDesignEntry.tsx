import { StrictMode } from "react";
import { App } from "components/App";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { createUniversalStore } from "store";

const Root = ({ store }: { store: ReturnType<typeof createUniversalStore> }) => {
  console.warn("you are using antDesign component library!");

  return (
    <StrictMode>
      <Provider store={store}>
        <Router>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </Router>
      </Provider>
    </StrictMode>
  );
};

export { Root };
