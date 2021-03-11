import { Reducer } from "redux";
import { produce } from "immer";
import { clientAction } from "./action";
import { actionName } from "config/action";
import { StateActionMapType, StateAction, State } from "@/types/share/store";

type CurrentState = State<{}>;

let initState: CurrentState;

let reducer: Reducer<CurrentState>;

let actionReducerMap: StateActionMapType<CurrentState>;

initState = { data: {}, error: null, loading: true, loaded: false };

reducer = (state: CurrentState = initState, action: StateAction) => {
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

actionReducerMap = {
  [clientAction.SETDATALOADING(actionName.currentUser)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SETDATASUCESS(actionName.currentUser)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data;
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SETDATAFAIL(actionName.currentUser)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export default reducer;
