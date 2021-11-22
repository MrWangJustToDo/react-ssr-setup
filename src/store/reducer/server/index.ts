import { combineReducers } from "redux";
import { apiName } from "config/api";
import { homeReducer, blogReducer, typeReducer, tagReducer, userHomeReducer } from "./action";

export const server = combineReducers({
  [apiName.home]: homeReducer,
  [apiName.type]: typeReducer,
  [apiName.tag]: tagReducer,
  [apiName.blog]: blogReducer,
  [apiName.userHome]: userHomeReducer,
});
