import { Middleware } from "../compose";

export const globalEnv: Middleware = (next) => async (args) => {
  const { PUBLIC_API_HOST, ANIMATE_ROUTER } = process.env;
  args.env = JSON.stringify({ PUBLIC_API_HOST, ANIMATE_ROUTER });

  await next(args);
};
