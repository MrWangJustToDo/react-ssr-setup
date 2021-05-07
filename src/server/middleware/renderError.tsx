import React from "react";
import PrettyError from "pretty-error";
import { renderToString } from "react-dom/server";

import Html from "components/Template/html";

import { RenderErrorType } from "types/server";

const pre = new PrettyError();

const renderError: RenderErrorType = ({ res, code, e }) =>
  res.send(
    "<!doctype html>" +
      renderToString(
        <Html>
          {`<h1>server render error!</h1>
            <hr />
            <p style='padding-left: 10px; font-size: 20px'>
              error code:
              <b>${code}</b>
              <br />
              <br />
              <pre style='font-size: 18px; color: red'>${e.toString()}</pre>
            </p>
          <script>console.log(\`${pre.render(e)}\`)</script>`}
        </Html>
      )
  );

export { renderError };
