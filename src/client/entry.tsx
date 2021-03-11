import React from "react";
import { hydrate, render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { loadableReady } from "@loadable/component";

import { configureStore } from "share/store/store";
import App from "components/App";

const store = window.store || configureStore({ initialState: { server: {}, client: {} } });
const place = document.querySelector("#app");

const content = (
  <Provider store={store}>
    <Router>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Router>
  </Provider>
);

loadableReady(() => {
  if (__DEVELOPMENT__) {
    render(content, place);
  } else {
    hydrate(content, place);
  }
});