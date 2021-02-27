import { AnyAction } from "redux";
import { state } from "./store";

const LOAD = "instalment/LOAD";
const LOAD_SUCCESS = "instalment/LOAD_SUCCESS";
const LOAD_FAIL = "instalment/LOAD_FAIL";

const initialState: state = {
  loading: true,
  loaded: false,
};

export default function instalment(state = initialState, action: AnyAction) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    default:
      return state;
  }
}
