import { determineUserLang } from "utils/i18n";
import { Middleware } from "../compose";

export const initLang: Middleware = (next) => async (args) => {
  const { req } = args;
  const lang = determineUserLang(req.acceptsLanguages(), req.path);

  args.lang = lang;
  args.env && (args.env["LANG"] = lang);

  await next(args);
};
