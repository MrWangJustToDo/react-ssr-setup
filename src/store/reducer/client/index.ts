import { combineReducers } from "redux";
import { actionName } from "config/action";
import {
  archiveReducer,
  blogIdReducer,
  headerReducer,
  homePageReducer,
  ipReducer,
  resultReducer,
  tagPageReducer,
  tagReducer,
  tokenReducer,
  typeReducer,
} from "./action";

export const client = combineReducers({
  [actionName.currentHeader]: headerReducer,
  [actionName.currentHomePage]: homePageReducer,
  [actionName.currentToken]: tokenReducer,
  [actionName.currentType]: typeReducer,
  [actionName.currentTag]: tagReducer,
  [actionName.currentTagPage]: tagPageReducer,
  [actionName.currentBlogId]: blogIdReducer,
  [actionName.currentArchive]: archiveReducer,
  [actionName.currentIp]: ipReducer,
  [actionName.currentResult]: resultReducer,
});
