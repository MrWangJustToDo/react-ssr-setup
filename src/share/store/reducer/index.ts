import { combineReducers } from "redux";
import clientReducer from "./client";
import serverReducer from "./server";

export default combineReducers({
  client: clientReducer,
  server: serverReducer,
});
