import { produce } from "immer";
import { Reducer } from "redux";
import { apiName } from "config/api";
import { serverAction } from "../share/action";
import { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "types/store/reducer";

type BlogContentObject = Record<string, unknown>;

type CurrentState = ReducerState<BlogContentObject>;

const initState: CurrentState = { data: {}, error: null, loaded: false, loading: false };

const blogReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<BlogContentObject>) => {
  const actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<BlogContentObject> = {
  [serverAction.GET_DATA_LOADING(apiName.blog)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GET_DATA_SUCCESS(apiName.blog)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = { ...proxy.data, ...action.data } || {};
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GET_DATA_FAIL(apiName.blog)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { blogReducer };
