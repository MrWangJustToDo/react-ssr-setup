declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    DEV_HOST: string;
    DEV_PORT: string;
    WDS_PORT: string;
    PROD_PORT: string;
    SSR: string;
    UI: "antd" | "material";
    PUBLIC_API_HOST: string;
    CRYPTO_KEY: string;
    SERVER_ENTRY: string;
    CLIENT_ENTRY: string;
    MIDDLEWARE: string;
    ANIMATE_ROUTER: string;
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

declare module "*.module.css" {
  const css: { readonly [key: string]: string };
  export default css;
}

declare module "*.css" {
  const css: { readonly [key: string]: string };
  export default css;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare const __CLIENT__: boolean;
declare const __SERVER__: boolean;
declare const __SSR__: boolean;
declare const __DEVELOPMENT__: boolean;
declare const __MIDDLEWARE__: boolean;
declare const __ANIMATE_ROUTER__: boolean;
declare const __BUILD_TIME__: string;
declare const PUBLIC_API_HOST: string;
declare const ANIMATE_ROUTER: boolean;

interface Window {
  __cache: unknown;
  __request: unknown;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  __ENV__: { PUBLIC_API_HOST: string; ANIMATE_ROUTER: boolean; SSR: boolean; CRYPTO_KEY: string; LANG: string; UI: "antd" | "material" };
}
