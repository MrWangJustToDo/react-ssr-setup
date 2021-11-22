import React from "react";
import type { HelmetData } from "react-helmet-async";

type HTMLProps = {
  children?: string;
  link?: React.ReactElement[];
  script?: React.ReactElement[];
  reduxInitialState?: string;
  helmetContext?: { helmet?: HelmetData };
};

export const HTML = ({ children = "", link = [], script = [], reduxInitialState = "{}", helmetContext = {} }: HTMLProps) => {
  const { helmet } = helmetContext;
  return (
    <html lang="zh">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {helmet?.base.toComponent()}
        {helmet?.title.toComponent()}
        {helmet?.meta.toComponent()}
        {helmet?.link.toComponent()}
        {helmet?.script.toComponent()}
        {link.filter(Boolean).map((ele) => ele)}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__PRELOADED_STATE__ = ${reduxInitialState}`,
          }}
        />
      </head>
      <body>
        <div id="loading_bar" />
        <div id="content" dangerouslySetInnerHTML={{ __html: children }} />
        {script.filter(Boolean).map((ele) => ele)}
      </body>
    </html>
  );
};
