import { NextFunction, Request, Response } from "express";

type ExpressRequest = Request & { session?: object; user?: any; config?: { cache?: CacheConfigProps; user?: UserConfigProps } };

/* render */
interface RenderProps {
  req: Request;
  res: Response;
  next: NextFunction;
}
interface RenderType {
  (props: RenderProps): void;
}
interface RenderErrorType {
  (props: RenderProps & { code?: number; e: Error }): void;
}

/* api */
interface ApiResponseData<T> {
  code?: number;
  time?: string;
  state?: string;
  data?: T;
  last?: any[];
  methodName?: string;
}
interface ApiResponseProps<T> {
  res: Response;
  statuCode?: number;
  resDate: ApiResponseData<T>;
}
interface ApiResponseType<T> {
  (props: ApiResponseProps<T>): void;
}
interface RequestHandlerProps {
  req: ExpressRequest;
  res: Response;
  next: NextFunction;
}
interface RequestHandlerType {
  (props: RequestHandlerProps): Promise<any>;
}
type ErrHandlerProps = RequestHandlerProps & {
  e: Error;
  code?: number;
};
interface ErrHandlerType {
  (props: ErrHandlerProps): void;
}
interface CacheConfigProps {
  cacheTime?: number;
  needCache?: boolean;
  needDelete?: string | string[] | boolean;
}
interface UserConfigProps {
  needCheck?: boolean;
  checkStrict?: boolean;
}
interface AutoRequestHandlerProps {
  requestHandler: RequestHandlerType;
  errHandler: ErrHandlerType;
  strict?: boolean;
  time?: number;
  cacheConfig?: CacheConfigProps;
  userConfig?: UserConfigProps;
}
