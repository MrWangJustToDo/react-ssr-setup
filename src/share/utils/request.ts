import axios, { AxiosRequestConfig } from "axios";

import { delay } from "./delay";
import { level, log } from "./log";
import { PendingType, RemovePendingType } from "@/types/share";

let pending: Array<PendingType>;
let removePending: RemovePendingType;
let retryCount: number;
let retryDelay: number;

pending = [];
retryCount = 3;
retryDelay = 1000;

const CancelToken = axios.CancelToken;
const instance = axios.create({
  timeout: 6000,
  responseType: "json",
});

// 移除重复请求
removePending = (config) => {
  const index = pending.findIndex(({ url, method, params, data }) => {
    if (
      config.url === url &&
      config.method === method &&
      JSON.stringify(config.params) === JSON.stringify(params) &&
      JSON.stringify(config.data) === JSON.stringify(data)
    ) {
      return true;
    } else {
      return false;
    }
  });
  if (index !== -1) {
    pending[index].cancel();
    pending.splice(index, 1);
  }
};

// 添加请求拦截器
instance.interceptors.request.use(
  (request) => {
    removePending(request);
    request.cancelToken = new CancelToken((c) => {
      pending.push({ url: request.url, method: request.method, params: request.params, data: request.data, cancel: c });
    });
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    removePending(response.config);
    return response;
  },
  (error) => {
    const response = error.response;

    /*
    switch (response?.status) {
      case 401:
        // token失效
        break;
      case 403:
        // 没有权限
        break;
      case 500:
        // 服务端错误
        break;
      case 503:
        // 服务端错误
        break;
      default:
        break;
    }
    */

    const config = <AxiosRequestConfig & { __retryCount: number }>error.config;
    if (config && response?.data?.code instanceof Number) {
      // 确定是网络问题执行重试
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount >= retryCount) {
        log(`network error, retry : ${config.__retryCount}`, level.warn);
        return Promise.reject(response?.data?.data || "404 not found!");
      }
      config.__retryCount++;
      
      return delay(retryDelay, () => instance(config));
    }

    return Promise.reject(response?.data?.data || "404 not found!");
  }
);

export { instance };
