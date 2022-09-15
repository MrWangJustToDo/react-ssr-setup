// could define more config for request
declare module "axios" {
  export interface AxiosRequestConfig<D = unknown> {
    useMock?: boolean;
    fallback?: D;
  }
}

export {};
