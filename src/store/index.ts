import thunkMiddleware from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware, compose, Middleware } from "redux";

import { rootSaga } from "./saga";
import { rootReducer } from "./reducer";
import { SagaManager } from "./saga/utils";
import type { SagaStore, StoreState } from "types/store";

type CreateStoreProps = {
  initialState?: StoreState;
  middleware?: Middleware[];
};

const devTools =
  __CLIENT__ && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsDenylist: [] });

const composeEnhancers = devTools || compose;

export const createUniversalStore = (props: CreateStoreProps = {}): SagaStore => {
  const { initialState, middleware = [] } = props;
  const sagaMiddleware = createSagaMiddleware();
  const allMiddleware = [thunkMiddleware, sagaMiddleware, ...middleware];
  const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...allMiddleware))) as SagaStore;
  store.sagaTask = SagaManager.startSagas(rootSaga, sagaMiddleware);

  // Enable Webpack hot module
  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept("./reducer", () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { rootReducer: nextRootReducer } = require("./reducer");
      store.replaceReducer(nextRootReducer);
    });

    module.hot.accept("./saga", () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { rootSaga: nextRootSaga } = require("./saga");
      SagaManager.cancelSagas(store);
      store.sagaTask = SagaManager.startSagas(nextRootSaga, sagaMiddleware);
    });
  }

  return store;
};
