import { ServerError } from "server/utils/error";
import { createUniversalStore } from "store";
import { Middleware } from "../compose";

export const initStore: Middleware = (next) => async (args) => {
  const { lang } = args;
  if (!lang) {
    throw new ServerError("lang 初始化失败", 500);
  }
  const store = createUniversalStore();
  args.store = store;
  await next(args);
};
