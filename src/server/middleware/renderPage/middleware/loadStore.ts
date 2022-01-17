import { allRoutes } from "router/routes";
import { ServerError } from "server/utils/error";
import { preLoad } from "utils/preLoad";
import { Middleware } from "../compose";

export const loadStore: Middleware = (next) => async (args) => {
  const { req, res, lang, store } = args;

  if (!lang || !store) {
    throw new ServerError(`server 初始化失败 lang: ${lang}, store: ${store}`, 500);
  }

  const { error, redirect, serverSideProps, cookies } = await preLoad(allRoutes, req.url, store, { req, lang });

  if (cookies) {
    Object.keys(cookies).forEach((key) => {
      res.cookie(key, cookies[key]);
    });
  }

  if (error) {
    throw new ServerError(error, 403);
  }

  if (redirect) {
    if (typeof redirect === "object") {
      res.writeHead(redirect.code, { location: redirect.redirect });
    } else {
      res.writeHead(302, { Location: redirect });
    }
    res.end();
  } else {
    args.serverSideProps = serverSideProps;
    await next(args);
  }
};
