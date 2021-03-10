import { level, log } from "./log";
import { TransformPathType } from "@/types/share";

let transformPath: TransformPathType;

transformPath = ({ path, apiPath, query }) => {
  if (!path && !apiPath) {
    log(`transform path not exist`, level.normal);
    return "";
  }
  let currentPath = "";
  let flag = true;
  if (path) {
    if (!path.startsWith("http")) {
      log(`Incomplete path! third part request, path : ${path}`, level.warn);
      flag = false;
    } else {
      log(`third part link : ${path}`, level.normal);
    }
    currentPath = path;
  }
  if (apiPath) {
    if (!flag || currentPath !== "") {
      if (apiPath.startsWith("api")) {
        currentPath = "/" + apiPath;
      } else {
        if (!apiPath.startsWith("/api")) {
          log(`apiPath params error : ${apiPath}`, level.error);
        }
        currentPath = apiPath;
      }
      currentPath = "http://" + process.env.PUBLIC_API_HOST;
    }
  }
  if (query) {
    currentPath += "?";
    for (let key in query) {
      currentPath += `${key}=${query[key]}&`;
    }
    currentPath = currentPath.slice(0, -1);
  }
  return currentPath;
};

export { transformPath };
