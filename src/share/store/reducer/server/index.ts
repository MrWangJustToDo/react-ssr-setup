import { combineReducers } from "redux";
import home from "./home";
import { apiName } from "config/api";

export default combineReducers({
  [apiName.home]: home,
});
