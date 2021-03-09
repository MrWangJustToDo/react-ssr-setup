import { NextFunction, Request, Response } from "express";

export type ExpressRequest = Request & { session?: object; user?: any; config?: { cache?: CacheConfigProps; user?: UserConfigProps } };

/* render */
export interface RenderProps {
  req: Request;
  res: Response;
  next: NextFunction;
}
export interface RenderType {
  (props: RenderProps): void;
}
export interface RenderErrorType {
  (props: RenderProps & { code?: number; e: Error }): void;
}

/* api */
export interface ApiResponseData<T> {
  code?: number;
  time?: string;
  state?: string;
  data?: T;
  last?: any[];
  methodName?: string;
}
export interface ApiResponseProps<T> {
  res: Response;
  statuCode?: number;
  resDate: ApiResponseData<T>;
}
export interface ApiResponseType<T> {
  (props: ApiResponseProps<T>): void;
}
export interface RequestHandlerProps {
  req: ExpressRequest;
  res: Response;
  next: NextFunction;
}
export interface RequestHandlerType {
  (props: RequestHandlerProps): Promise<any>;
}
export type ErrHandlerProps = RequestHandlerProps & {
  e: Error;
  code?: number;
};
export interface ErrHandlerType {
  (props: ErrHandlerProps): void;
}
export interface CacheConfigProps {
  cacheTime?: number;
  needCache?: boolean;
  needDelete?: string | string[] | boolean;
}
export interface UserConfigProps {
  needCheck?: boolean;
  checkStrict?: boolean;
}
export interface AutoRequestHandlerProps {
  requestHandler: RequestHandlerType;
  errHandler: ErrHandlerType;
  strict?: boolean;
  time?: number;
  cacheConfig?: CacheConfigProps;
  userConfig?: UserConfigProps;
}
