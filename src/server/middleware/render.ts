import { RenderType } from "server";
import { renderCSR } from "./renderCSR";
import { renderSSR } from "./renderSSR";

let render: RenderType;

// 渲染函数
render = ({ req, res, next }) => {
  const { isSSR } = req.params;
  if (isSSR || process.env.SSR || process.env.NODE_ENV === 'development') {
    renderSSR({ req, res, next });
  } else {
    renderCSR({ req, res, next });
  }
};

export { render };
