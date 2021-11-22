import { produce } from "immer";
import { Reducer } from "redux";
import { actionName } from "config/action";
import { clientAction } from "../share/action";
import { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "types/store/reducer";

type CurrentState = ReducerState<number>;

const initState: CurrentState = { data: 1, error: null, loading: false, loaded: false };

const homePageReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<number>) => {
  const actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<number> = {
  [clientAction.SET_DATA_LOADING(actionName.currentHomePage)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = 1;
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SET_DATA_SUCCESS(actionName.currentHomePage)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || 1;
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SET_DATA_FAIL(actionName.currentHomePage)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = 1;
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { homePageReducer };
