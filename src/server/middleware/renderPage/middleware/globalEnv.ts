import { Middleware } from "../compose";

export const globalEnv: Middleware = (next) => async (args) => {
  const { PUBLIC_API_HOST, ANIMATE_ROUTER, SSR, CRYPTO_KEY, UI } = process.env;
  const CurrentUi = UI === "material" ? UI : UI === "antd" ? UI : "antd";
  args.env = { PUBLIC_API_HOST, ANIMATE_ROUTER: JSON.parse(ANIMATE_ROUTER), SSR: JSON.parse(SSR), CRYPTO_KEY, UI: CurrentUi };

  await next(args);
};
