import axios from "axios";

import { fetchAdapter, mockAdapter } from "./adapter";
import { fallbackData, mockLog, serverLog } from "./Interceptor";

import type { BaseCreateOptions, RequestInterceptor, ResponseInterceptor } from "./type";

const BASE_TIME_OUT = 3000;

const BASE_REQUEST_INTERCEPTORS: RequestInterceptor = [[mockLog]];

const BASE_RESPONSE_INTERCEPTORS: ResponseInterceptor = [
  [undefined, serverLog],
  [undefined, fallbackData],
];

function createRequest(props: BaseCreateOptions = {}) {
  const { method = "get", timeout = BASE_TIME_OUT, requestInterceptors = [], responseInterceptors = [], ...axiosConfig } = props;

  const axiosInstance = axios.create({
    method,
    timeout,
    adapter: axiosConfig.useMock ? mockAdapter : fetchAdapter,
    ...axiosConfig,
  });

  const finalRequestInterceptors = BASE_REQUEST_INTERCEPTORS.concat(requestInterceptors);

  const finalResponseInterceptors = BASE_RESPONSE_INTERCEPTORS.concat(responseInterceptors);

  finalRequestInterceptors.forEach((interceptor) => axiosInstance.interceptors.request.use(...interceptor));

  finalResponseInterceptors.forEach((interceptor) => axiosInstance.interceptors.response.use(...interceptor));

  return axiosInstance;
}

export { createRequest };
