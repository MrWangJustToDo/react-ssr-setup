import React, { useEffect, useRef } from "react";
import { IntlProvider } from "react-intl";
import { allRoutes } from "router/routes";
import { defaultLang } from "i18n";
import { Layout } from "./Layout";
import { LoadingBar } from "./LoadingBar";
import { WrapperRoute } from "./WrapperRoute";
import { useSelector } from "react-redux";
import { StoreState } from "types/store";

export const App = () => {
  const htmlRef = useRef<HTMLHtmlElement | null>(null);
  const lang = useSelector<StoreState, string>((state) => state.client.currentLang.data);
  const data = useSelector<StoreState, { [props: string]: any }>((state) => state.server.lang.data);
  useEffect(() => {
    if (!htmlRef.current) {
      htmlRef.current = document.querySelector("html");
    }
    htmlRef.current && (htmlRef.current.lang = lang);
  }, [lang]);
  return (
    <IntlProvider locale={lang} messages={data[lang] || {}} defaultLocale={defaultLang}>
      <WrapperRoute routes={allRoutes} LoadingBar={LoadingBar} animationRouter={__ANIMATE_ROUTER__}>
        <Layout />
      </WrapperRoute>
    </IntlProvider>
  );
};
