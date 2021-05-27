declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    DEV_HOST: string;
    DEV_PORT: number;
    WDS_PORT: number;
    PROD_PORT: number;
    SSR: string;
    PUBLIC_API_HOST: string;
    SERVERENTRY: string;
    CLIENTENTRY: string;
    MIDDLEWARE_DEVELOP: string;
    SOURCE_LANGUAGE: "string";
  }
  interface Global {
    webStats: string;
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
  export default any;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.scss" {
  export default any;
}

declare const __CLIENT__: boolean;
declare const __SERVER__: boolean;
declare const __DEVELOPMENT__: boolean;

interface Window {
  __PRELOADED_STATE__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
}
