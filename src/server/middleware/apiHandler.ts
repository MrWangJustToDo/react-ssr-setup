import assign from "lodash/assign";
import { Cache } from "share/utils/cache";
import { log } from "share/utils/log";
import { ServerError } from "server/utils/error";
import { NextFunction, Request, Response } from "express";
import {
  ApiResponseData,
  ApiResponseProps,
  AutoRequestHandlerProps,
  CacheConfigProps,
  ErrHandlerType,
  RequestHandlerProps,
  UserConfigProps,
  RequestHandlerType,
} from "types/server";

const cache = new Cache<string, any>();

const success = <T>({ res, statuCode = 200, resDate }: ApiResponseProps<T>): ApiResponseData<T> => {
  resDate.time = new Date().toLocaleString();
  res.status(statuCode).json(resDate);
  return resDate;
};

const fail = <T>({ res, statuCode = 404, resDate, methodName }: ApiResponseProps<T> & { methodName?: string }): void => {
  if (methodName && process.env.NODE_ENV === "development") {
    resDate["methodName"] = `method: ${methodName} 出现错误`;
  }
  resDate.time = new Date().toLocaleString();
  res.status(statuCode).json(resDate);
};

const transformHandler = (requestHandler: RequestHandlerType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return await requestHandler({ req, res, next });
  };
};

const catchHandler = (requestHandler: RequestHandlerType, errHandler: ErrHandlerType) => {
  return async ({ req, res, next }: RequestHandlerProps) => {
    try {
      return await requestHandler({ req, res, next });
    } catch (e) {
      log(e, "error");
      if (errHandler && typeof errHandler === "function") {
        if (e instanceof ServerError) {
          errHandler({ req, res, next, e, code: e.code });
        } else {
          errHandler({ req, res, next, e, code: 404 });
        }
      } else {
        fail({ res, resDate: { state: "访问失败", data: e.toString() } });
      }
    }
  };
};

const cacheHandler = (requestHandler: RequestHandlerType, time: number | undefined, cacheConfig: CacheConfigProps) => {
  return async ({ req, res, next }: RequestHandlerProps) => {
    const currentCacheConfig = assign(cacheConfig, req.config?.cache);
    const key = req.originalUrl;
    const needCache = currentCacheConfig.needCache;
    const cacheTime = currentCacheConfig.cacheTime ? currentCacheConfig.cacheTime : time;
    const needDelete = currentCacheConfig.needDelete;
    if (needDelete) {
      if (Array.isArray(needDelete)) {
        needDelete.forEach(cache.deleteRightNow);
      } else if (typeof needDelete === "string") {
        cache.deleteRightNow(needDelete);
      } else if (needDelete === true) {
        cache.deleteRightNow(key);
      }
    }
    if (needCache) {
      const cacheValue = cache.get(key);
      if (cacheValue) {
        log(`get response data from cache. method: ${req.method} url: ${req.originalUrl} key: ${key}`, "normal");
        success({ res, resDate: cacheValue });
      } else {
        const actionValue = await requestHandler({ req, res, next });
        if (actionValue) {
          cache.set(key, actionValue, cacheTime);
        } else {
          log(`nothing to return, so nothing to cache. method: ${req.method} url: ${req.originalUrl}`, "normal");
        }
      }
    } else {
      return await requestHandler({ req, res, next });
    }
  };
};

const userHandler = (requestHandler: RequestHandlerType, strict: boolean | undefined, userConfig: UserConfigProps) => {
  return async ({ req, res, next }: RequestHandlerProps) => {
    const currentUserConfig = assign(userConfig, req.config?.user);
    const needCheck = currentUserConfig.needCheck;
    const checkStrict = currentUserConfig.checkStrict ? currentUserConfig.checkStrict : strict;
    if (needCheck) {
      if (!req.user) {
        throw new ServerError("未登录，拒绝访问", 400);
      }
      if (checkStrict) {
        if (req.user.userId !== req.query.userId) {
          throw new ServerError("登录用户与操作用户不一致", 401);
        }
      }
      return await requestHandler({ req, res, next });
    } else {
      return await requestHandler({ req, res, next });
    }
  };
};

const autoRequestHandler = ({ requestHandler, errHandler, strict, time, cacheConfig, userConfig }: AutoRequestHandlerProps) => {
  return transformHandler(catchHandler(userHandler(cacheHandler(requestHandler, time, cacheConfig || {}), strict, userConfig || {}), errHandler));
};

export { success, fail, transformHandler, catchHandler, cacheHandler, userHandler, autoRequestHandler };
