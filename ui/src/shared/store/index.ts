import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { reducer } from "./reducer";

import type { Middleware, PreloadedState } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";

type CreateStoreProps = {
  preloadedState?: PreloadedState<ReturnType<typeof reducer>>;
  middleware?: Middleware[];
};

export const createUniversalStore = (props: CreateStoreProps = {}) => {
  const { preloadedState, middleware = [] as const } = props;

  const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
    devTools: true,
    preloadedState: preloadedState,
    reducer,
  });

  if (__DEVELOPMENT__ && !__VITE__ && module.hot) {
    module.hot.accept("./reducer", () => store.replaceReducer(reducer));
  }

  return store;
};

export type RootState = ReturnType<typeof reducer>;

export type RootStore = ReturnType<typeof createUniversalStore>;

export type AppDispatch = ReturnType<typeof createUniversalStore>["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
