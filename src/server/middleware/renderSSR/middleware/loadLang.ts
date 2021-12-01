import { preLoadLang } from "utils/preLoad";
import { Middleware } from "../compose";

export const loadLang: Middleware = (next) => async (args) => {
  const { store, lang } = args;
  if (store && lang) {
    await preLoadLang({ store, lang });
  }
  await next(args);
};
