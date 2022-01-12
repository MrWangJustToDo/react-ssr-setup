import { apiName } from "config/api";
import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import cookie from "js-cookie";
import { useChangeLoadingWithoutRedux } from "./useLoadingBar";
import { getDataAction_Server } from "store/reducer/server/share/action";
import type { StoreState } from "types/store";

export const useLang = () => {
  const lang = useSelector<StoreState, string>((state) => state.client.currentLang.data);
  const { start, end } = useChangeLoadingWithoutRedux();
  const langRef = useRef(lang);
  const dispatch = useDispatch();
  langRef.current = lang;
  const changeLang = useCallback(
    (newLang: string) => {
      if (langRef.current !== newLang) {
        Promise.resolve(start())
          .then(() => {
            cookie.set("site_lang", newLang);
            return dispatch(getDataAction_Server({ name: apiName.lang, lang: newLang }));
          })
          .then(end)
          .catch(end);
      }
    },
    [dispatch, end, start]
  );

  return { lang, changeLang };
};
