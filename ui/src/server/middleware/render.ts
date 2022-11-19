import { getIsSSR } from "@shared";

import { renderSSR, renderCSR, renderP_CSR } from "./renderPage";

import type { RenderType } from "@server/type";

// 渲染函数
const render: RenderType = async ({ req, res }) => {
  if (__CSR__) {
    await renderP_CSR({ req, res });
  } else {
    const { isSSR } = req.query;
    if (isSSR || getIsSSR()) {
      await renderSSR({ req, res });
    } else {
      await renderCSR({ req, res });
    }
  }
};

export { render };
