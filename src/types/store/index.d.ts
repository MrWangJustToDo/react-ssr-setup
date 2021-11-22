import { Store } from "redux";
import { Task } from "redux-saga";
import { ThunkDispatch } from "redux-thunk";
import { ClientReducer, ClientReducerKey } from "./client";
import { ServerReducer, ServerReducerKey } from "./server";

export interface StoreState {
  server: { [T in ServerReducerKey]: ServerReducer[T] };
  client: { [T in ClientReducerKey]: ClientReducer[T] };
}

export interface SagaStore extends Store<StoreState> {
  sagaTask?: Task;
  dispatch: ThunkDispatch;
}
