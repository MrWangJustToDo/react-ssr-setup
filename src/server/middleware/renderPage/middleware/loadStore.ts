import { allRoutes } from "router/routes";
import { ServerError } from "server/utils/error";
import { preLoad } from "utils/preLoad";
import { Middleware } from "../compose";

export const loadStore: Middleware = (next) => async (args) => {
  const { req, res, lang, store } = args;

  if (!lang || !store) {
    throw new ServerError(`server 初始化失败 lang: ${lang}, store: ${store}`, 500);
  }

  const { error, redirect, serverSideProps } = await preLoad(allRoutes, req.url, store, { req, lang });

  // console.log(serverSideProps);

  if (error) {
    throw new ServerError(error, 403);
  }

  if (redirect) {
    res.writeHead(302, { Location: redirect });
    res.end();
  } else {
    args.serverSideProps = serverSideProps;
    await next(args);
  }
};
