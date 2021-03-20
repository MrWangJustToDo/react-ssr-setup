import { combineReducers } from "redux";

import { actionName } from "config/action";
import currentUser from "./currentUser";

export default combineReducers({
  [actionName.currentUser]: currentUser,
});
