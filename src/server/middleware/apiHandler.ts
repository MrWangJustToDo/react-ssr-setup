import PrettyError from 'pretty-error';
import { NextFunction, Request, Response } from "express";
import { ActionHandlerProps, ActionHandlerType, ApiResponseData, ApiResponseProps, ErrHandlerType } from "server";

const pre = new PrettyError();

let success = <T>({ res, statuCode = 200, resDate }: ApiResponseProps<T>): ApiResponseData<T> => {
  resDate.time = new Date().toLocaleString();
  res.status(statuCode).json(resDate);
  return resDate;
};

let fail = <T>({ res, statuCode = 404, resDate, methodName }: ApiResponseProps<T> & { methodName?: string }): void => {
  if (methodName && process.env.NODE_ENV === "development") {
    resDate["methodName"] = `method: ${methodName} 出现错误`;
  }
  resDate.time = new Date().toLocaleString();
  res.status(statuCode).json(resDate);
};

let actionTransform = (actionHandler: ActionHandlerType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return await actionHandler({ req, res, next });
  };
};

let actionCatch = (actionHandler: ActionHandlerType, errHandler: ErrHandlerType) => {
  return async ({ req, res, next }: ActionHandlerProps) => {
    try {
      return await actionHandler({ req, res, next });
    } catch (e) {
      console.log(pre.render(e))
    }
  };
};

export { success, fail, actionTransform };
