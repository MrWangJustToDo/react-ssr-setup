import thunkMiddleware from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware, compose } from "redux";

import { rootSaga } from "./saga";
import { rootReducer } from "./reducer";
import type { SagaStore, StoreState } from "types/store";

type CreateStoreProps = {
  initialState?: StoreState;
  middleware?: any[];
};

const devTools =
  __CLIENT__ && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist: [] });

const composeEnhancers = devTools || compose;

export const sagaStore = (props: CreateStoreProps = {}): SagaStore => {
  const { initialState, middleware = [] } = props;
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...[thunkMiddleware, sagaMiddleware].concat(...middleware))));
  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

  if (__DEVELOPMENT__ && (module as any).hot) {
    // Enable Webpack hot module replacement for reducers
    (module as any).hot.accept("./reducer", () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nextRootReducer = require("./reducer");
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
