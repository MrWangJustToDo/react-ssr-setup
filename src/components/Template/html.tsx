import React from "react";

import { HTMLType } from "types/components";

let HTML: HTMLType;

HTML = ({ children, link = [], script = [], state = "{}", helmetContext = {} }) => {
  const { helmet } = helmetContext;
  return (
    <html lang="">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {helmet?.base.toComponent()}
        {helmet?.title.toComponent()}
        {helmet?.meta.toComponent()}
        {helmet?.link.toComponent()}
        {helmet?.script.toComponent()}
        {link.filter(Boolean).map((ele) => ele)}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__PRELOADED_STATE__ = ${state}`,
          }}
        />
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: children || "" }} />
        {script.filter(Boolean).map((ele) => ele)}
      </body>
    </html>
  );
};

export default HTML;
