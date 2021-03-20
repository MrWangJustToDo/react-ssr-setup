import { renderCSR } from "./renderCSR";
import { renderSSR } from "./renderSSR";
import { RenderType } from "types/server";

let render: RenderType;

// 渲染函数
render = async ({ req, res, next }) => {
  const { isSSR } = req.query;
  if (isSSR || JSON.parse(process.env.SSR)) {
    await renderSSR({ req, res, next });
  } else {
    renderCSR({ req, res, next });
  }
};

export { render };
