import { useCallbackRef } from "@chakra-ui/react";

import { useAppDispatch, useAppSelector } from "@shared";
import { changeClientLang } from "@shared/store/reducer/client/clientLang";
import { serverLangAsyncAction } from "@shared/store/reducer/server/serverLang";

import { useLoading } from "./useLoadingStore";

export const useLang = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((state) => state.client.clientLang.value);
  const setLoading = useLoading((state) => state.setLoading);
  const changeLang = useCallbackRef((newLang: string) => {
    if (lang !== newLang) {
      Promise.resolve()
        .then(() => setLoading(true))
        .then(() => dispatch(serverLangAsyncAction(newLang)))
        .then(() => dispatch(changeClientLang(newLang)))
        .then(() => setLoading(false));
    }
  });

  return { lang, changeLang };
};
