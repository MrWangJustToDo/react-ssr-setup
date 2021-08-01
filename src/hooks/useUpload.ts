import { useRef } from "react";

const UseUpload = () => {
  const ref = useRef<HTMLInputElement>();

  // 获取文件的MD5   服务端需要存储下当前上传文件的所有MD5值  进行判断
  const getMd5 = () => {
    console.log("tetst");
  };

  // 监听
};

export default UseUpload;
