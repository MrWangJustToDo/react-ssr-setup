import React from "react";
import { HTMLType } from 'components/components';

let HTML: HTMLType;

HTML = ({
  children,
  css = [],
  script = [],
  state = "{}",
  helmetContext: { helmet },
}) => (
  <html lang="">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {helmet.base.toComponent()}
      {helmet.title.toComponent()}
      {helmet.meta.toComponent()}
      {helmet.link.toComponent()}
      {helmet.script.toComponent()}
      {css.filter(Boolean).map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <script
        dangerouslySetInnerHTML={{
          // TODO: Add jsesc/stringify here
          // see: https://twitter.com/HenrikJoreteg/status/1143953338284703744
          __html: `window.__PRELOADED_STATE__ = ${state}`,
        }}
      />
    </head>
    <body>
      <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
      {script.filter(Boolean).map((src) => (
        <script key={src} src={src} />
      ))}
      <script>window.main();</script>
    </body>
  </html>
);

export default HTML;
