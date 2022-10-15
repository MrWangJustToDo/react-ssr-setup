// could define more config for request
declare module "axios" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface AxiosRequestConfig<D = any> {
    useMock?: boolean;
    fallback?: D;
  }
}

export {};
