import { NextFunction, Request, Response } from "express";

/* render */
interface RenderProps {
  req: Request;
  res: Response;
  next: NextFunction;
}

interface RenderType {
  (props: RenderProps): void;
}

/* api */
interface ApiResponseData<T> {
  code?: number;
  time?: string;
  state?: string;
  data?: T;
  res: any[];
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
interface ActionHandlerProps {
  req: Request;
  res: Response;
  next: NextFunction;
}
interface ActionHandlerType {
  (props: ActionHandlerProps): Promise<any>;
}
type ErrHandlerProps = ActionHandlerProps & {
  e: Error;
  code?: number;
};
interface ErrHandlerType {
  (props: ErrHandlerProps): void;
}
