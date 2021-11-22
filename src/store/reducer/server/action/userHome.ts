import { produce } from "immer";
import { Reducer } from "redux";
import { apiName } from "config/api";
import { serverAction } from "../share/action";
import { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "types/store/reducer";

type CurrentState = ReducerState<string[]>;

const initState: CurrentState = { data: [], error: null, loaded: false, loading: false };

const userHomeReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<string[]>) => {
  const actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<string[]> = {
  [serverAction.GET_DATA_LOADING(apiName.userHome)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GET_DATA_SUCCESS(apiName.userHome)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || [];
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GET_DATA_FAIL(apiName.userHome)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { userHomeReducer };
