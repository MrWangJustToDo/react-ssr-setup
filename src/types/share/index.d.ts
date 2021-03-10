import { AxiosRequestConfig, Method } from "axios";
import { apiName } from "config/api";

/* delay */
interface Cancel {
  (key: string): void;
}
interface Delay {
  <T>(time: number, action: () => T, key?: string): Promise<T | void>;
}
interface TimeoutMap {
  [props: string]: Array<NodeJS.Timeout | void>;
}
interface ResolveMap {
  [props: string]: Array<(() => void) | void>;
}
interface KeyMap {
  [props: string]: number;
}
/* action */
interface ActionHandlerType {
  <T, K, V>(state: T | void, action: (T) => K, otherAction?: () => V): K | V | void;
}
/* request */
interface PendingType {
  url?: string;
  method?: Method;
  params: any;
  data: any;
  cancel: Function;
}
interface RemovePendingType {
  (props: AxiosRequestConfig): void;
}
/* path */
interface QueryProps {
  [props: string]: string;
}
interface TransformPathProps {
  path?: string;
  apiPath?: apiName;
  query?: QueryProps;
}
interface TransformPathType {
  (props: TransformPathProps): string;
}
/* header */
interface HeaderProps {
  [props: string]: string | boolean;
}
interface GetHeaderType {
  (props?: HeaderProps): HeaderProps;
}
/* fetcher */
interface AutoRequestProps {
  method?: Method;
  path?: string;
  apiPath?: apiName;
  query?: QueryProps;
  header?: HeaderProps;
  data?: object;
}
interface ApiRequestResult<T> {
  code: number;
  data: T | T[];
  state: string;
  res: any;
}
interface AutoRequestType {
  run?: <T>(path?: string, query?: QueryProps) => Promise<T>;
  (props?: RequestProps): AutoRequestType;
}
interface CreateReqyestType {
  (props: AutoRequestProps): AutoRequestType;
}
