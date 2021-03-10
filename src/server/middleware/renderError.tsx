import React from "react";
import { renderToString } from "react-dom/server";

import Html from "components/Template/html";
import { RenderErrorType } from "@/types/server";

let renderError: RenderErrorType;

renderError = ({ res, code, e }) =>
  res.send(
    "<!doctype html>" +
      renderToString(
        <Html link={[]} script={[]}>
          {`<h1>server render error!</h1> <hr /> <p style='padding-left: 10px; font-size: 20px'> error code: <b>${code}</b> <br /> <br /> ${e.toString()} </p>`}
        </Html>
      )
  );

export { renderError };
