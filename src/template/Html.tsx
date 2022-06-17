import { ColorModeScript } from "@chakra-ui/react";

import type { StorageManager } from "@chakra-ui/react";
import type { EmotionCriticalToChunks } from "@emotion/server/types/create-instance";
import type { ReactElement, ReactNode } from "react";
import type { HelmetServerState } from "react-helmet-async";

type HTMLProps = {
  env?: string;
  lang?: string;
  children?: ReactNode;
  cookieStorage?: StorageManager;
  reduxInitialState?: string;
  preLoad?: ReactElement[];
  link?: ReactElement[];
  script?: ReactElement[];
  emotionChunks?: EmotionCriticalToChunks;
  helmetContext?: { helmet?: HelmetServerState };
};

// NOTE this template only run on the server
// like _document.js in the next.js
export const HTML = ({
  lang,
  children,
  link = [],
  script = [],
  preLoad = [],
  cookieStorage,
  emotionChunks,
  helmetContext = {},
  reduxInitialState = "{}",
  env = "{}",
}: HTMLProps) => {
  const { helmet } = helmetContext;

  return (
    <html lang={lang || ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="red" />
        <meta name="build-time" content={__BUILD_TIME__} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* a type issue for react-helmet-async  */}
        <>
          {helmet?.base.toComponent()}
          {helmet?.title.toComponent()}
          {helmet?.meta.toComponent()}
          {helmet?.link.toComponent()}
          {helmet?.noscript.toComponent()}
          {helmet?.style.toComponent()}
          {helmet?.script.toComponent()}
        </>
        {preLoad.filter(Boolean).map((ele) => ele)}
        {link.filter(Boolean).map((ele) => ele)}
        {emotionChunks?.styles.map((style) => (
          <style data-server data-emotion={`${style.key} ${style.ids.join(" ")}`} key={style.key} dangerouslySetInnerHTML={{ __html: style.css }} />
        ))}
        <ColorModeScript initialColorMode={cookieStorage?.get()} />
        <script
          id="__autoInject__"
          dangerouslySetInnerHTML={{
            __html: `/* will delete this item when page hydrate */ window.__ENV__ = ${env}; document.querySelector("script#__autoInject__")?.remove();`,
          }}
        />
        <script id="__preload_env__" type="application/json" dangerouslySetInnerHTML={{ __html: `${env}` }} />
        <script id="__preload_state__" type="application/json" dangerouslySetInnerHTML={{ __html: `${reduxInitialState}` }} />
      </head>
      <body>
        <div id="__content__">{children}</div>
        {script.filter(Boolean).map((ele) => ele)}
      </body>
    </html>
  );
};
