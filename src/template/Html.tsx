import React from "react";
import { theme } from "config/theme";
import type { HelmetData } from "react-helmet-async";
import type { EmotionCriticalToChunks } from "@emotion/server/types/create-instance";

type HTMLProps = {
  env?: string;
  lang?: string;
  children?: string;
  link?: React.ReactElement[];
  script?: React.ReactElement[];
  reduxInitialState?: string;
  emotionChunks?: EmotionCriticalToChunks;
  helmetContext?: { helmet?: HelmetData };
};

export const HTML = ({ lang, children = "", link = [], script = [], reduxInitialState = "{}", helmetContext = {}, emotionChunks, env = "{}" }: HTMLProps) => {
  const { helmet } = helmetContext;

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta name="build-time" content={__BUILD_TIME__} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        {helmet?.base.toComponent()}
        {helmet?.title.toComponent()}
        {helmet?.meta.toComponent()}
        {helmet?.link.toComponent()}
        {helmet?.script.toComponent()}
        {link.filter(Boolean).map((ele) => ele)}
        {emotionChunks?.styles.map((style) => (
          <style data-emotion={`${style.key} ${style.ids.join(" ")}`} key={style.key} dangerouslySetInnerHTML={{ __html: style.css }} />
        ))}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__PRELOADED_STATE__ = ${reduxInitialState}; window.__ENV__ = ${env}; window.__LANG__ = '${lang}'`,
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
