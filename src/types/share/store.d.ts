// 定义类型的文件
import { Action, AnyAction } from "redux";
import { actionName } from "config/action";
import { apiName } from "config/api";

/* reducer */
interface State<T> {
  readonly data: T;
  readonly error: any;
  readonly loading: boolean;
  readonly loaded: boolean;
}
interface StateAction extends Action<T> {
  data?: T;
  error?: any;
  loadingState?: boolean;
}
interface StateActionMapType<T> {
  [props: string]: (state: T, action: StateAction) => T;
}

/* --- client --- */

/* action */
interface ClientActionType {
  SETDATALOADING: (name: actionName) => string;
  SETDATAACTION: (name: actionName) => string;
  SETDATASUCESS: (name: actionName) => string;
  SETDATAFAIL: (name: actionName) => string;
}
interface CreateClientActionProps<T> {
  name: actionName;
  data?: T;
  error?: any;
}
interface CreateClientActionType {
  <T>(props: CreateClientActionProps<T>): StateAction<T>;
}

/* --- server --- */

/* action */
interface ServerActionType {
  GETDATALOADING: (name: apiName) => string;
  GETDATAACTION: (name: apiName) => string;
  GETDATASUCESS: (name: apiName) => string;
  GETDATAFAIL: (name: apiName) => string;
}
interface CreateServerActionProps<T> {
  name: apiName;
  data?: T;
  error?: any;
}
interface CreateServerActionType {
  <T>(props: CreateServerActionProps<T>): StateAction<T>;
}
