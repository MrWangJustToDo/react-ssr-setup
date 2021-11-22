import { actionName } from "config/action";
import {
  archiveReducer,
  blogIdReducer,
  headerReducer,
  homePageReducer,
  ipReducer,
  resultReducer,
  tagPageReducer,
  tokenReducer,
  typeReducer,
  tagReducer,
} from "store/reducer/client/action";
import { ReducerStateAction } from "./reducer";

export type ClientReducerKey = actionName;

export type ClientReducer = {
  [actionName.currentArchive]: ReturnType<typeof archiveReducer>;
  [actionName.currentBlogId]: ReturnType<typeof blogIdReducer>;
  [actionName.currentHeader]: ReturnType<typeof headerReducer>;
  [actionName.currentHomePage]: ReturnType<typeof homePageReducer>;
  [actionName.currentIp]: ReturnType<typeof ipReducer>;
  [actionName.currentResult]: ReturnType<typeof resultReducer>;
  [actionName.currentTag]: ReturnType<typeof tagReducer>;
  [actionName.currentTagPage]: ReturnType<typeof tagPageReducer>;
  [actionName.currentToken]: ReturnType<typeof tokenReducer>;
  [actionName.currentType]: ReturnType<typeof typeReducer>;
};

export interface ClientActionType {
  SET_DATA_LOADING: (name: ClientReducerKey) => string;
  SET_DATA_ACTION: (name: ClientReducerKey) => string;
  SET_DATA_SUCCESS: (name: ClientReducerKey) => string;
  SET_DATA_FAIL: (name: ClientReducerKey) => string;
}
export interface CreateClientActionProps<T> {
  name: ClientReducerKey;
  data?: T;
  error?: unknown | Error;
}
export interface CreateClientActionType {
  <T>(props: CreateClientActionProps<T>): ReducerStateAction<T>;
}
