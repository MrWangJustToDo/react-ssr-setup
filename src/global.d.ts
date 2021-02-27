declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    DEV_HOST: string;
    DEV_PORT: number;
    WDS_PORT: number;
    PROD_PORT: number;
    SERVERENTRY: string;
    CLIENTENTRY: string;
    SOURCE_LANGUAGE: "string";
  }
}

declare module '*.scss' {
  export default any;
}

declare const __CLIENT__: boolean;
declare const __SERVER__: boolean;
declare const __DEVELOPMENT__: boolean;
declare const assets: { [props: string]: string };

interface Window {
  browserHistory: any;
  store: any;
  main: Function;
  __PRELOADED_STATE__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
}
