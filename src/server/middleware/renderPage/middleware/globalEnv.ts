import { Middleware } from "../compose";

export const globalEnv: Middleware = (next) => async (args) => {
  const { PUBLIC_API_HOST, ANIMATE_ROUTER, SSR, CRYPTO_KEY } = process.env;
  args.env = { PUBLIC_API_HOST, ANIMATE_ROUTER: JSON.parse(ANIMATE_ROUTER), SSR: JSON.parse(SSR), CRYPTO_KEY };

  await next(args);
};
