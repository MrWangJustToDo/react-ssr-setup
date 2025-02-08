import memoizeFun from "lodash/memoize";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const memoize = (__DEVELOPMENT__ ? (fn: Function) => fn : memoizeFun) as <T extends (...args: any[]) => any>(fn: T) => T;

const __isSERVER__ = typeof window === "undefined";

export const getIsMiddleware = memoize(() => (__isSERVER__ ? JSON.parse(process.env.MIDDLEWARE || "false") : window.__ENV__.isMIDDLEWARE));

export const getIsSSR = memoize(() => (__isSERVER__ ? JSON.parse(process.env.SSR || "false") : window.__ENV__.isSSR));

export const getIsAnimateRouter = memoize(() => (__isSERVER__ ? JSON.parse(process.env.ANIMATE_ROUTER || "false") : window.__ENV__.isANIMATE_ROUTER));

export const getIsP_CSR = memoize(() => (__isSERVER__ ? false : window.__ENV__.isPURE_CSR));

export const getIsStaticGenerate = memoize(() =>
  __isSERVER__ ? JSON.parse(process.env.STATIC_GENERATE || "false") && process.env.NODE_ENV === "production" : window.__ENV__.isSTATIC
);

export const getPublicApi = memoize(() =>
  __isSERVER__ ? (__DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST) : window.__ENV__.PUBLIC_API_HOST
);
