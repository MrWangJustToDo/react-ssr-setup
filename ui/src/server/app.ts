/* eslint-disable @typescript-eslint/no-var-requires */
import { wrapperMiddlewareRequest } from "./middleware/apiHandler";
import { renderError } from "./middleware/renderError";

export const generateHandler = () => {
  const { render } = require("./middleware/render");
  return wrapperMiddlewareRequest({
    requestHandler: render,
    errorHandler: ({ req, res, code, e }) => {
      console.log("goto");
      renderError({ req, res, e, code });
    },
  });
};
