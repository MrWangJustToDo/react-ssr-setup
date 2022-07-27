import { useCallbackRef } from "@chakra-ui/react";

import { useLoadingState } from "@app/common/WrapperLoading";
import { useAppDispatch, useAppSelector } from "@app/store";
import { changeClientLang } from "@app/store/reducer/client/clientLang";
import { serverLangAsyncAction } from "@app/store/reducer/server/serverLang";

export const useLang = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((state) => state.client.clientLang.value);
  const { setLoading } = useLoadingState();
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
