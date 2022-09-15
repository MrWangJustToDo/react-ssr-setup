import { changeClientLang } from "./store/reducer/client/clientLang";
import { serverLangAsyncAction } from "./store/reducer/server/serverLang";

import type { AppDispatch } from "./store";

export const supportedLang = {
  en: "English",
  ar: "Arabic (عربي)",
};

export const loadCurrentLang = async (dispatch: AppDispatch, lang: keyof typeof supportedLang) => {
  await dispatch(serverLangAsyncAction(lang));
  dispatch(changeClientLang(lang));
};

export const defaultLang = "en";
