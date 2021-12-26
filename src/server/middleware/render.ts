import { renderSSR, renderCSR } from "./renderPage";
import { RenderType } from "types/server";

const generateGetSSR = () => {
  let SSR = false;
  let state = false;
  return () => {
    if (state) return SSR;
    SSR = JSON.parse(process.env.SSR);
    state = true;
    return SSR;
  };
};

const getSSR = generateGetSSR();

// 渲染函数
const render: RenderType = async ({ req, res }) => {
  const { isSSR } = req.query;
  if (isSSR || getSSR()) {
    await renderSSR({ req, res });
  } else {
    await renderCSR({ req, res });
  }
};

export { render };
