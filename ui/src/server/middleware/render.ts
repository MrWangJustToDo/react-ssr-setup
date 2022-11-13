import { getIsSSR } from "@shared";

import { webpackRenderCSR, webpackRenderP_CSR, webpackRenderSSR, viteRenderCSR, viteRenderP_CSR, viteRenderSSR } from "./renderPage";

import type { RenderType } from "@server/type";

// 渲染函数
const render: RenderType = async ({ req, res }) => {
  const useVITE = process.env.FORMWORK === "vite";
  if (__CSR__) {
    useVITE ? await viteRenderP_CSR({ req, res }) : await webpackRenderP_CSR({ req, res });
  } else {
    const { isSSR } = req.query;
    if (isSSR || getIsSSR()) {
      useVITE ? await viteRenderSSR({ req, res }) : await webpackRenderSSR({ req, res });
    } else {
      useVITE ? await viteRenderCSR({ req, res }) : await webpackRenderCSR({ req, res });
    }
  }
};

export { render };
