import { Draft, produce } from "immer";
import { Reducer } from "redux";
import { apiName } from "config/api";
import { serverAction } from "./action";
import { State, StateAction, StateActionMapType } from "types/share/store";

type CurrentState = State<{}>;

let initState: CurrentState;
let reducer: Reducer<CurrentState>;
let actionReducerMap: StateActionMapType<{}>;

initState = { data: {}, error: null, loading: true, loaded: false };

reducer = (state: CurrentState = initState, action: StateAction<{}>) => {
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

actionReducerMap = {
  [serverAction.GETDATALOADING(apiName.home)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GETDATASUCESS(apiName.home)]: (state: CurrentState, action) =>
    produce(state, (proxy: Draft<CurrentState>) => {
      proxy.data = action.data!;
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GETDATAFAIL(apiName.home)]: (state: CurrentState, action) =>
    produce(state, (proxy: Draft<CurrentState>) => {
      proxy.data = {};
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export default reducer;
