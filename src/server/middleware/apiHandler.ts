import { NextFunction, Request, Response } from "express";
import { ActionHandlerType, ApiResponseData, ApiResponseProps } from "./middleware";

let success = <T>({ res, statuCode = 200, resDate }: ApiResponseProps<T>): ApiResponseData<T> => {
  resDate.time = new Date().toLocaleString();
  res.status(statuCode).json(resDate);
  return resDate;
};

let fail = <T>({ res, statuCode = 404, resDate, methodName }: ApiResponseProps<T> & { methodName?: string }): void => {
  if (methodName && process.env.NODE_ENV === "develop") {
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

export { success, fail, actionTransform };
