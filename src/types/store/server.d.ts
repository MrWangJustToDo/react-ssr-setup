import { apiName } from "config/api";
import { Dispatch } from "redux";
import { homeReducer, blogReducer, langReducer } from "store/reducer/server/action";
import { ReducerStateAction } from "./reducer";

export type ServerReducerKey = apiName;

export type ServerReducer = {
  [apiName.home]: ReturnType<typeof homeReducer>;
  [apiName.blog]: ReturnType<typeof blogReducer>;
  [apiName.lang]: ReturnType<typeof langReducer>;
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
