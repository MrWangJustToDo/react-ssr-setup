import { Middleware } from "../compose";

export const globalEnv: Middleware = (next) => async (args) => {
  const { PUBLIC_API_HOST, ANIMATE_ROUTER, SSR } = process.env;
  args.env = { PUBLIC_API_HOST, ANIMATE_ROUTER: JSON.parse(ANIMATE_ROUTER), SSR: JSON.parse(SSR) };

  await next(args);
};
