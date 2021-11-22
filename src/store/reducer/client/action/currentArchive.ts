import { produce } from "immer";
import { Reducer } from "redux";
import { clientAction } from "../share/action";
import { actionName } from "config/action";
import { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "types/store/reducer";

type ArchiveProps = Record<string, string>;

type CurrentState = ReducerState<ArchiveProps>;

const initState: CurrentState = { data: {}, error: null, loaded: false, loading: false };

const archiveReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<ArchiveProps>) => {
  const actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<ArchiveProps> = {
  [clientAction.SET_DATA_LOADING(actionName.currentArchive)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SET_DATA_SUCCESS(actionName.currentArchive)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || {};
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SET_DATA_FAIL(actionName.currentArchive)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { archiveReducer };
