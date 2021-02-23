import { renderCSR } from "./renderCSR";
import { renderSSR } from "./renderSSR";
import { RenderType } from "./middleware";

let render: RenderType;

// 渲染函数
render = ({ req, res, next }) => {
  const { isSSR } = req.params;
  if (isSSR || process.env.SSR) {
    renderSSR({ req, res, next });
  } else {
    renderCSR({ req, res, next });
  }
};

export { render };
