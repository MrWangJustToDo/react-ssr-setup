import React from "react";

import { HTMLType } from "types/components";

const HTML: HTMLType = ({ children = "", link = [], script = [], state = "{}", helmetContext = {} }) => {
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
            __html: `window.__PRELOADED_STATE__ = ${state}`,
          }}
        />
      </head>
      <body>
        <div id="loadingbar" />
        <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
        {script.filter(Boolean).map((ele) => ele)}
        <script src="https://cdn.jsdelivr.net/stats.js/r11/stats.min.js"></script>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
          alert('开始计算帧数')
          var stats = new Stats(); 
          stats.setMode(0); 
          stats.domElement.style.position = 'absolute'; 
          stats.domElement.style.right = '0px'; 
          stats.domElement.style.top = '0px'; 
          document.body.appendChild(stats.domElement);
          const start = () => {
            stats.end();
            stats.begin();
            requestAnimationFrame(start);
          }
          stats.begin();
          requestAnimationFrame(start);
          `,
          }}
        ></script>
      </body>
    </html>
  );
};

export default HTML;
