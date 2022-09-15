import { AxiosError } from "axios";
import once from "lodash/once";

import { __SERVER__ } from "./env";

import type { AxiosRequestConfig } from "axios";

export const serverLog = (error: AxiosError | Error | unknown) => {
  if (__SERVER__ || __DEV__) {
    if (error instanceof AxiosError) {
      const { config, status } = error;
      console.error(`[axios]: request error, url: ${config.baseURL}${config.url}, statusCode: ${status}, error: ${error.message}`);
    } else if (error instanceof Error) {
      console.error(`[axios]: request error, message: ${error.message}`);
    } else {
      console.error(`[axios]: request error`);
    }
  }
  throw error;
};

const logOnce = once((config: AxiosRequestConfig) =>
  console.warn(`[axios] current request use mock data, method: ${config.method}, url: ${config.baseURL || ""}${config.url}`)
);

export const mockLog = (config: AxiosRequestConfig) => {
  if (config.useMock && __DEV__) {
    logOnce(config);
  }
  return config;
};

// this function used for safe request & type, if we pass a fallback data config, this request will never block UI or code
// NOTE: the fallback data's type should match the result type, otherwise will have error
export const fallbackData = (error: AxiosError | Error | unknown) => {
  if (error instanceof AxiosError) {
    const { config } = error;
    const { fallback } = config;
    if (fallback) return { data: fallback };
  }
  throw error;
};
