import { allRoutes } from "router/routes";
import { ServerError } from "server/utils/error";
import { createUniversalStore } from "store";
import { preLoad } from "utils/preLoad";
import { Middleware } from "../compose";

const empty = {};
export const initStore: Middleware = (next) => async (args) => {
  const { req, res, lang } = args;
  if (!lang) {
    throw new ServerError("lang 初始化失败", 500);
  }
  const store = createUniversalStore();
  const { headers, error, redirect } = await preLoad(allRoutes, req.url, store, empty, { req, lang });
  if (headers) {
    Object.keys(headers).forEach((key) => res.setHeader(key, headers[key]));
  }

  if (error) {
    throw new ServerError(error, 403);
  }

  if (redirect) {
    res.writeHead(302, { Location: redirect });
    res.end();
  } else {
    args.store = store;
    await next(args);
  }
};
