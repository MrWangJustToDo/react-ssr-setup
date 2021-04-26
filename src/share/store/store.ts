import thunkMiddleware from "redux-thunk";
import createSagaMiddleware, { Task } from "redux-saga";
import { createStore, applyMiddleware, compose, Store } from "redux";
import reducer from "./reducer";
import rootSaga from "./saga";

export type State = {
  server: { [props: string]: any };
  client: { [props: string]: any };
};

export type StoreParams = {
  initialState: State;
  middleware?: any[];
};

export const thunkStore = ({ initialState, middleware = [] }: StoreParams): Store => {
  const devtools =
    __CLIENT__ && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist: [] });

  const composeEnhancers = devtools || compose;

  const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(...[thunkMiddleware].concat(...middleware))));

  return store;
};

export interface SagaStore extends Store {
  sagaTask?: Task;
}

export const sagaStore = ({ initialState, middleware = [] }: StoreParams): Store => {
  const devtools =
    __CLIENT__ && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist: [] });

  const composeEnhancers = devtools || compose;

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(...[sagaMiddleware].concat(...middleware))));

  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};
