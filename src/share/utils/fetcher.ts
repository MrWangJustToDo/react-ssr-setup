import { AxiosResponse } from "axios";
import assign from "lodash/assign";
import { apiName } from "config/api";
import { Cache } from "./cache";
import { getHeader } from "./headers";
import { instance } from "./request";
import { transformPath } from "./path";
import { AutoRequestProps, AutoRequestType, CreateRequestType, QueryProps } from "types/share";

let createRequest: CreateRequestType;

const cache = new Cache<string, any>();

createRequest = (props: AutoRequestProps = {}) => {
  const { method, path, apiPath, query, data, header } = props;
  const tempPath = transformPath({ path, apiPath });
  const autoRequest: AutoRequestType = (props: AutoRequestProps = {}) => {
    const newMethod = props.method ? props.method : method;
    const newPath = props.path ? props.path : path;
    const newApiPath = props.apiPath ? props.apiPath : apiPath;
    const newQuery = assign(query, props.query);
    const newData = assign(data, props.data);
    const newHeader = assign(header, props.header);
    return createRequest({ method: newMethod, path: newPath, apiPath: newApiPath, query: newQuery, data: newData, header: newHeader });
  };
  autoRequest.run = <T>(currentPath?: string, currentQuery?: QueryProps) => {
    const targetPath = currentPath ? currentPath : tempPath;
    if (!targetPath) {
      throw new Error("request path should not undefined!!");
    }
    const targetQuery = assign(query, currentQuery);
    const relativePath = targetPath.startsWith("http")
      ? transformPath({ path: targetPath, query: targetQuery })
      : transformPath({ apiPath: targetPath as apiName, query: targetQuery });
    const target = cache.get(relativePath);
    if (target) {
      return Promise.resolve(<T>target);
    } else {
      const currentMethod = method || "get";
      const currentHeader = __CLIENT__ ? getHeader(header) : header;
      let requestPromise: Promise<AxiosResponse<T>>;
      requestPromise = instance({ method: currentMethod, headers: currentHeader, url: relativePath, data });
      return requestPromise.then((res) => res.data).then((resData) => (cache.set(relativePath, resData), resData));
    }
  };
  return autoRequest;
};

export { createRequest };
