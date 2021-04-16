import { TransformType } from "types/router";

let filter: TransformType;

filter = (routers) => {
  const temp: { [props: string]: boolean } = {};
  return routers.filter((config) => {
    if (!temp[config.path?.toString()!]) {
      temp[config.path?.toString()!] = true;
      return true;
    } else {
      return false;
    }
  });
};

export { filter };
