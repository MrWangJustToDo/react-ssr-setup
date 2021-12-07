import { determineUserLang } from "i18n";
import { Middleware } from "../compose";

export const initLang: Middleware = (next) => async (args) => {
  const { req } = args;
  const lang = determineUserLang(req.acceptsLanguages(), req.path);

  args.lang = lang;

  await next(args);
};
