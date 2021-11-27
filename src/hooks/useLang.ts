import { apiName } from "config/api";
import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useChangeLoading } from "./useLoadingBar";
import { getDataAction_Server } from "store/reducer/server/share/action";
import type { StoreState } from "types/store";

export const useLang = () => {
  const lang = useSelector<StoreState, string>((state) => state.client.currentLang.data);
  const { start, end } = useChangeLoading();
  const langRef = useRef(lang);
  const dispatch = useDispatch();
  langRef.current = lang;
  const changeLang = useCallback(
    (newLang: string) => {
      if (langRef.current !== newLang) {
        Promise.resolve(start())
          .then(() => dispatch(getDataAction_Server({ name: apiName.lang, lang: newLang })))
          .then(end)
          .catch(end);
      }
    },
    [dispatch, end, start]
  );

  return { lang, changeLang };
};
