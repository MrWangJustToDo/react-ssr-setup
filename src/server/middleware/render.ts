import { renderSSR, renderCSR } from "./renderPage";
import { RenderType } from "types/server";

const SSR = JSON.parse(process.env.SSR);

// 渲染函数
const render: RenderType = async ({ req, res }) => {
  const { isSSR } = req.query;
  if (isSSR || SSR) {
    await renderSSR({ req, res });
  } else {
    await renderCSR({ req, res });
  }
};

export { render };
