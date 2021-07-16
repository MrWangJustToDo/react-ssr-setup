import { usePinch } from "hooks/usePinch";
import React from "react";

const Item = () => {
  const [t, c] = usePinch<HTMLImageElement, HTMLDivElement>();

  return (
    <div style={{ margin: "0px auto", width: "100vw", overflow: "hidden" }}>
      <div ref={c} style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", touchAction: "none" }}>
        <div ref={t}>
          <img
            style={{ display: "block", objectFit: "cover" }}
            draggable="false"
            src="https://h2.ioliu.cn/bing/FreshSalt_ZH-CN12818759319_1920x1080.jpg"
            alt=""
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default Item;
