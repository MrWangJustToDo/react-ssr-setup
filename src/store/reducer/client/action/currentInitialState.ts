import { produce } from "immer";

import { actionName } from "config/action";

import { clientAction } from "../share/action";

import type { Reducer } from "redux";
import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "types/store/reducer";

// support cache getInitialState function props?
type CurrentState = ReducerState<Record<string, unknown>>;

const initialState: CurrentState = { data: {}, error: null, loading: false, loaded: false };

const initialStateReducer: Reducer<CurrentState> = (state: CurrentState = initialState, action: ReducerStateAction<Record<string, unknown>>) => {
  const actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<Record<string, unknown>> = {
  [clientAction.SET_DATA_LOADING(actionName.currentInitialState)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.error = null;
      proxy.loading = action.loadingState ?? true;
      proxy.loaded = false;
    }),
  [clientAction.SET_DATA_SUCCESS(actionName.currentInitialState)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = { ...proxy.data, ...action.data };
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SET_DATA_FAIL(actionName.currentInitialState)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { initialStateReducer };
