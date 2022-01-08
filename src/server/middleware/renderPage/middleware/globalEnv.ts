import { getIsAnimateRouter, getIsMiddleware, getIsSSR } from "utils/env";
import { Middleware } from "../compose";

export const globalEnv: Middleware = (next) => async (args) => {
  const { PUBLIC_API_HOST, CRYPTO_KEY } = process.env;
  args.env = {
    UI: __UI__,
    isSSR: getIsSSR(),
    CRYPTO_KEY,
    PUBLIC_API_HOST,
    isMIDDLEWARE: getIsMiddleware(),
    isDEVELOPMENT: __DEVELOPMENT__,
    isANIMATE_ROUTER: getIsAnimateRouter(),
  };

  await next(args);
};
