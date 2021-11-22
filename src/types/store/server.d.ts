import { apiName } from "config/api";
import { Dispatch } from "redux";
import { homeReducer, typeReducer, tagReducer, blogReducer, userHomeReducer } from "store/reducer/server/action";
import { ReducerStateAction } from "./reducer";

export type ServerReducerKey = apiName.home | apiName.type | apiName.tag | apiName.blog | apiName.userHome;

export type ServerReducer = {
  [apiName.home]: ReturnType<typeof homeReducer>;
  [apiName.type]: ReturnType<typeof typeReducer>;
  [apiName.tag]: ReturnType<typeof tagReducer>;
  [apiName.blog]: ReturnType<typeof blogReducer>;
  [apiName.userHome]: ReturnType<typeof userHomeReducer>;
};

export interface ServerActionType {
  GET_DATA_LOADING: (name: ServerReducerKey) => string;
  GET_DATA_ACTION: (name: ServerReducerKey) => string;
  GET_DATA_SUCCESS: (name: ServerReducerKey) => string;
  GET_DATA_FAIL: (name: ServerReducerKey) => string;
}

export type CreateServerActionProps<T, K> = {
  name: ServerReducerKey;
  data?: T;
  error?: unknown | Error;
} & K;

export interface CreateServerActionType {
  <T, K = unknown>(props: CreateServerActionProps<T, K>): ReducerStateAction<T>;
}

export interface CreateServerActionWithDispatchType {
  <T, K = unknown>(props: CreateServerActionProps<T, K>): (dispatch: Dispatch) => Promise<void>;
}
