import { useCallback, useEffect, useRef } from "react";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";

import { defaultLang } from "utils/i18n";

import type { ReactNode } from "react";
import type { StoreState } from "types/store";

export const WrapperLang = ({ children }: { children: ReactNode }) => {
  const htmlRef = useRef<HTMLHtmlElement | null>(null);
  const data = useSelector<StoreState, StoreState["server"]["lang"]["data"]>(useCallback((state) => state.server.lang.data, []));
  const lang = useSelector<StoreState, StoreState["client"]["currentLang"]["data"]>(useCallback((state) => state.client.currentLang.data, []));

  useEffect(() => {
    if (!htmlRef.current) {
      htmlRef.current = document.querySelector("html");
    }
    if (htmlRef.current) {
      htmlRef.current.lang = lang;
    }
  }, [lang]);

  return (
    <IntlProvider locale={lang} messages={data[lang] || {}} defaultLocale={defaultLang}>
      {children}
    </IntlProvider>
  );
};
