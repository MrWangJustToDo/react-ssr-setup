declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    DEV_HOST: string;
    DEV_PORT: number;
    WDS_PORT: number;
    PROD_PORT: number;
    SSR: boolean;
    PUBLIC_API_HOST: string;
    SERVERENTRY: string;
    CLIENTENTRY: string;
    SOURCE_LANGUAGE: "string";
  }
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.scss" {
  export default any;
}

declare const __CLIENT__: boolean;
declare const __SERVER__: boolean;
declare const __DEVELOPMENT__: boolean;
declare const assets: { [props: string]: string };
declare const webStats: string;

interface Window {
  store: any;
  __PRELOADED_STATE__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
}
