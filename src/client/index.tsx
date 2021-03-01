import React from "react";
import { hydrate, render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { configureStore } from "share/store/store";
import App from "components/App";

const store = window.store || configureStore({ initialState: window.__PRELOADED_STATE__ });
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

window.main = () => {
  if (__DEVELOPMENT__) {
    render(content, place);
  } else {
    hydrate(content, place);
  }
};
