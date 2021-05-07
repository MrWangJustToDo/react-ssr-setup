import Cookies from "js-cookie";
import { GetHeaderType, HeaderProps } from "types/share";

const getHeader: GetHeaderType = (header = {}) => {
  const resultHeader: HeaderProps = {};
  for (const key in header) {
    if (header[key] === true) {
      resultHeader[key] = Cookies.get("token") || "";
    } else {
      resultHeader[key] = header[key];
    }
  }
  return resultHeader;
};

export { getHeader };
