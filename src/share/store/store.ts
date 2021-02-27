import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import reducer from "./reducer";

export type state = {
  [key: string]: any
}

export type StoreParams = {
  initialState: state;
  middleware?: any[];
};

export const configureStore = ({ initialState, middleware = [] }: StoreParams) => {
  const devtools =
    typeof window !== "undefined" &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist: [] });

  const composeEnhancers = devtools || compose;

  const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(...[thunkMiddleware].concat(...middleware))));

  return store;
};

export default configureStore;
