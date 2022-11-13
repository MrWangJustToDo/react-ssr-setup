/* eslint-disable @typescript-eslint/no-var-requires */
import { resolve } from "path";

import { wrapperMiddlewareRequest } from "./middleware/apiHandler";
import { renderError } from "./middleware/renderError";

export const generateHandler = () => {
  if (__VITE__) {
    return (async () => {
      const { render } = await import("./middleware/render");
      return await wrapperMiddlewareRequest({
        requestHandler: render,
        errorHandler: ({ req, res, code, e }) => renderError({ req, res, e, code }),
      });
    })();
    // const { render } = require(resolve(process.cwd(), "src/server/middleware/render.ts"));
    // return wrapperMiddlewareRequest({
    //   requestHandler: render,
    //   errorHandler: ({ req, res, code, e }) => renderError({ req, res, e, code }),
    // });
  } else {
    const { render } = require(resolve(process.cwd(), "src/server/middleware/render"));
    return wrapperMiddlewareRequest({
      requestHandler: render,
      errorHandler: ({ req, res, code, e }) => renderError({ req, res, e, code }),
    });
  }
};
