import assign from "lodash/assign";
import chalk from "chalk";
import { log } from "utils/log";
import { Cache } from "utils/cache";
import { ServerError } from "server/utils/error";
import { NextFunction, Response } from "express";
import { ApiResponseProps, ExpressRequest, MiddlewareConfig, MiddlewareContext, MiddlewareFunction, RequestHandlerType } from "types/server";

const cache = new Cache<string, unknown>();

let currentResponseDate: null | unknown = null;

export const success = <T>({ res, statusCode = 200, resDate }: ApiResponseProps<T>): void => {
  // 缓存当前成功的请求数据
  if (resDate.data || resDate.last) {
    currentResponseDate = resDate;
  } else {
    currentResponseDate = null;
  }
  resDate.code = resDate.code || 0;
  resDate.state = resDate.state || "获取成功";
  resDate.time = new Date().toLocaleString();
  res.status(statusCode).json(resDate);
};

export const fail = <T>({ res, statusCode = 404, resDate, methodName }: ApiResponseProps<T> & { methodName?: string }): void => {
  if (process.env.NODE_ENV === "development" && methodName) {
    resDate["methodName"] = `method: ${methodName} 出现错误`;
  } else {
    delete resDate["methodName"];
  }
  resDate.code = resDate.code || -1;
  resDate.state = resDate.state || "获取失败";
  resDate.time = new Date().toLocaleString();
  res.status(statusCode).json(resDate);
};

export const catchMiddlewareHandler: MiddlewareFunction = async (ctx, nextMiddleware) => {
  const { req, res, errorHandler } = ctx;
  try {
    await nextMiddleware();
  } catch (e) {
    log(new Error(`url: ${req.originalUrl}, method: ${req.method} error, ${(e as Error).message}`), "error");

    if (errorHandler && typeof errorHandler === "function") {
      if (e instanceof ServerError) {
        await errorHandler({ ctx, req, res, e, code: e.code, cache });
      } else if (e instanceof Error) {
        await errorHandler({ ctx, req, res, e, code: 404, cache });
      }
    } else {
      const url = req.originalUrl;
      const method = req.method;
      const methodName = ctx.requestHandler.name;
      fail({
        res,
        statusCode: e instanceof ServerError ? e.code : undefined,
        resDate: { state: `url: ${url}, method: ${method} 访问失败`, data: (e as Error).message },
        methodName,
      });
    }
  }
};

const cacheMiddlewareHandler: MiddlewareFunction = async (ctx, nextMiddleware) => {
  const { cacheConfig, cache, req, res } = ctx;
  const currentCacheConfig = assign({}, cacheConfig, req.config?.cache);
  const key = currentCacheConfig.cacheKey
    ? typeof currentCacheConfig.cacheKey === "function"
      ? currentCacheConfig.cacheKey({ req })
      : currentCacheConfig.cacheKey
    : req.originalUrl;

  const needCache = currentCacheConfig.needCache;
  const needDeleteBeforeRequest = currentCacheConfig.needDeleteBeforeRequest;
  const needDeleteAfterRequest = currentCacheConfig.needDeleteAfterRequest;
  const cacheTime = currentCacheConfig.cacheTime;
  const needDelete = currentCacheConfig.needDelete;
  if (needDelete) {
    if (Array.isArray(needDelete)) {
      needDelete.forEach((item: string | (({ req }: { req: ExpressRequest }) => string | string[])) => {
        if (typeof item === "function") {
          const key = item({ req });
          if (Array.isArray(key)) {
            key.forEach((i) => cache.deleteRightNow(i));
          } else {
            cache.deleteRightNow(key);
          }
        } else {
          cache.deleteRightNow(item);
        }
      });
    } else if (typeof needDelete === "string") {
      cache.deleteRightNow(needDelete);
    } else if (needDelete === true) {
      cache.deleteRightNow(key);
    } else {
      const key = needDelete({ req });
      if (Array.isArray(key)) {
        key.forEach((i) => cache.deleteRightNow(i));
      } else {
        cache.deleteRightNow(key);
      }
    }
  }
  if (needDeleteBeforeRequest) {
    if (Array.isArray(needDeleteBeforeRequest)) {
      needDeleteBeforeRequest.forEach((item: string | (({ req }: { req: ExpressRequest }) => string | string[])) => {
        if (typeof item === "function") {
          const key = item({ req });
          if (Array.isArray(key)) {
            key.forEach((i) => cache.deleteRightNow(i));
          } else {
            cache.deleteRightNow(key);
          }
        } else {
          cache.deleteRightNow(item);
        }
      });
    } else if (typeof needDeleteBeforeRequest === "string") {
      cache.deleteRightNow(needDeleteBeforeRequest);
    } else if (needDeleteBeforeRequest === true) {
      cache.deleteRightNow(key);
    } else {
      const key = needDeleteBeforeRequest({ req });
      if (Array.isArray(key)) {
        key.forEach((i) => cache.deleteRightNow(i));
      } else {
        cache.deleteRightNow(key);
      }
    }
  }
  if (needCache) {
    const cacheValue = cache.get(key);
    if (cacheValue) {
      log(`get response data from cache. method: ${req.method}, url: ${req.originalUrl}, key: ${key}`, "normal");
      success({ res, resDate: cacheValue });
    } else {
      await nextMiddleware();
      if (currentResponseDate) {
        cache.set(key, currentResponseDate, cacheTime);
      } else {
        log(`nothing to get, so nothing to cache. method: ${req.method}, url: ${req.originalUrl}`, "warn");
      }
    }
  } else {
    await nextMiddleware();
  }
  if (needDeleteAfterRequest) {
    if (Array.isArray(needDeleteAfterRequest)) {
      needDeleteAfterRequest.forEach((item: string | (({ req }: { req: ExpressRequest }) => string | string[])) => {
        if (typeof item === "function") {
          const key = item({ req });
          if (Array.isArray(key)) {
            key.forEach((i) => cache.deleteRightNow(i));
          } else {
            cache.deleteRightNow(key);
          }
        } else {
          cache.deleteRightNow(item);
        }
      });
    } else if (typeof needDeleteAfterRequest === "string") {
      cache.deleteRightNow(needDeleteAfterRequest);
    } else if (needDeleteAfterRequest === true) {
      cache.deleteRightNow(key);
    } else {
      const key = needDeleteAfterRequest({ req, cacheData: currentResponseDate });
      if (Array.isArray(key)) {
        key.forEach((i) => cache.deleteRightNow(i));
      } else {
        cache.deleteRightNow(key);
      }
    }
  }
};

const checkParamsMiddlewareHandler: MiddlewareFunction = async (ctx, nextMiddleware) => {
  const { paramsConfig, req } = ctx;
  const currentCheckParamsConfig = assign({}, paramsConfig, req.config?.params);
  const currentFromQuery = currentCheckParamsConfig.fromQuery;
  const currentFromBody = currentCheckParamsConfig.fromBody;
  if (currentFromBody && currentFromBody.length > 0) {
    for (let i = 0; i < currentFromBody.length; i++) {
      if (req.body[currentFromBody[i]] === undefined) {
        throw new ServerError(`请求参数错误, body: ${currentFromBody[i]}`, 403);
      }
    }
  }
  if (currentFromQuery && currentFromQuery.length > 0) {
    for (let i = 0; i < currentFromQuery.length; i++) {
      if (req.query[currentFromQuery[i]] === undefined) {
        throw new ServerError(`请求参数错误, query: ${currentFromQuery[i]}`, 403);
      }
    }
  }
  await nextMiddleware();
};

const decodeMiddlewareHandler: MiddlewareFunction = async (ctx, nextMiddleware) => {
  const { req, encodeConfig } = ctx;
  const currentEncodeConfig = encodeConfig || req.config?.encode;
  if (currentEncodeConfig) {
    if (typeof req.body.encode === "undefined") {
      throw new ServerError("当前请求体格式不正确", 400);
    } else {
      let encodeBodyString = req.body["encode"].toString() as string;
      if (process.env) {
        if (encodeBodyString.endsWith(process.env.NEXT_PUBLIC_STRING as string)) {
          encodeBodyString = encodeBodyString.slice(0, -(process.env.NEXT_PUBLIC_STRING || "").length);
        }
      }
      const bodyString = Buffer.from(encodeBodyString, "base64").toString();
      req.body = JSON.parse(bodyString);
    }
  }
  await nextMiddleware();
};

const logMiddlewareHandler: MiddlewareFunction = async (ctx, nextMiddleware) => {
  const url = ctx.req.originalUrl;
  const method = ctx.requestHandler.name;
  const key = chalk.redBright("[time log] method: " + method + ", url: " + url + ", time");
  console.time(key);
  await nextMiddleware();
  console.timeEnd(key);
};

// 默认请求的中间件函数，不执行下一个
const runRequestMiddlewareHandler: MiddlewareFunction = async (ctx) => {
  const { requestHandler, req, res, cache } = ctx;
  await requestHandler({ req, res, cache });
};

export const compose = (...middleWares: MiddlewareFunction[]) => {
  return function (ctx: MiddlewareContext, next: MiddlewareFunction | RequestHandlerType) {
    let runTime = 0;
    let index = -1;
    // 需要加上死循环判断
    function dispatch(i: number): Promise<any> {
      if (i <= index) {
        // 这些错误将会被 catchMiddlewareHandler  进行捕获
        throw new ServerError("compose index error, every middleware only allow call once", 500);
      }
      // 防止中间件死循环
      runTime++;
      if (runTime > middleWares.length + 5) {
        throw new ServerError("call middleWare many times, look like a infinite loop and will stop call next", 500);
      }
      index = i;
      const fn = middleWares[i] || next;
      if (fn) {
        try {
          return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
        } catch (e) {
          log("compose catch error", "error");
          return Promise.resolve(e);
        }
      } else {
        log("all middleware done, do not call next", "warn");
        return Promise.resolve();
      }
    }
    return dispatch(0);
  };
};

const composedHandler = compose(
  logMiddlewareHandler,
  catchMiddlewareHandler,
  decodeMiddlewareHandler,
  checkParamsMiddlewareHandler,
  cacheMiddlewareHandler,
  runRequestMiddlewareHandler
);

export const wrapperMiddlewareRequest = function (config: MiddlewareConfig, composed: ReturnType<typeof compose> = composedHandler) {
  return async (req: ExpressRequest, res: Response, next: NextFunction) => {
    // 每一个新的请求  需要清除原始的缓存数据
    currentResponseDate = null;
    const ctx = { ...config, req, res, next, cache };
    try {
      if (!ctx.goNext) {
        return await composed(ctx, ctx.requestHandler);
      } else {
        await composed(ctx, ctx.requestHandler);
        next();
      }
    } catch (e) {
      fail({ res, statusCode: 500, resDate: { data: (e as Error).toString(), methodName: "composed" } });
    }
  };
};
