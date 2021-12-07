import { renderSSR, renderCSR } from "./renderPage";
import { RenderType } from "types/server";

// 渲染函数
const render: RenderType = async ({ req, res }) => {
  const { isSSR } = req.query;
  if (isSSR || JSON.parse(process.env.SSR)) {
    await renderSSR({ req, res });
  } else {
    await renderCSR({ req, res });
  }
};

export { render };
