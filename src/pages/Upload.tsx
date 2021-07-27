import { apiName } from "config/api";
import React, { useCallback, useRef } from "react";
import { createRequest } from "share/utils/fetcher";

import style from "./style.module.scss";

const Upload = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const change = useCallback(() => {
    const { current: input } = inputRef;
    const { current: div } = divRef;
    if (input?.files?.length && div) {
      div.innerText = input.files[0].name;
      console.log(input.files[0].size);
      const uploadData = new FormData();
      uploadData.append("file", input.files[0]);
      createRequest({ method: "post", apiPath: apiName.upload, data: uploadData, header: { "Content-Type": "multipart/form-data" } })
        .run()
        .then(console.log)
        .catch(console.log);
    }
  }, []);

  return (
    <div>
      <h2>文件上传组件 点击 或者 拖动到</h2>
      <div className={style.upload}>
        <div ref={divRef}>点击选择或者拖动文件到此处</div>
        <input onChange={change} ref={inputRef} type="file" placeholder="请选择文件" />
      </div>
    </div>
  );
};

export default Upload;
