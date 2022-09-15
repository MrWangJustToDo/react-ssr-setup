import { AxiosError } from "axios";

import { fetchAdapter } from "./fetchAdapter";

import type { AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders } from "axios";

const mockAdapterRequest = ({ baseURL, url }: { baseURL?: string; url?: string }) => import(`@server/mock/${baseURL || ""}${url || ""}.json`);

// just for test
export async function mockAdapter(config: AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
  const { useMock, url, baseURL } = config;
  if (useMock) {
    try {
      const res = await mockAdapterRequest({ baseURL, url });
      return {
        data: res.default as unknown,
        status: 200,
        config: { url },
        headers: config.headers as AxiosResponseHeaders,
        statusText: "success",
      };
    } catch (e) {
      throw new AxiosError(`mock request error: ${(e as Error).message}`, AxiosError["ERR_BAD_RESPONSE"], config);
    }
  } else {
    return fetchAdapter(config);
  }
}
