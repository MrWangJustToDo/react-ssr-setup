import Cookies from "js-cookie";
import { GetHeaderType, HeaderProps } from "types/share";

let getHeader: GetHeaderType;

getHeader = (header = {}) => {
  const resultHeader: HeaderProps = {};
  for (let key in header) {
    if (header[key] === true) {
      resultHeader[key] = Cookies.get("token") || "";
    } else {
      resultHeader[key] = header[key];
    }
  }
  return resultHeader;
};

export { getHeader };
