import { changeClientLang } from '@app/store/reducer/client/clientLang';
import { serverLangAsyncAction } from '@app/store/reducer/server/serverLang';

import type { AppDispatch } from '@app/store';

export const defaultLang = 'en';

export const supportedLang = {
  en: 'English',
  ar: 'Arabic (عربي)',
};

export const loadCurrentLang = async (
  dispatch: AppDispatch,
  lang: keyof typeof supportedLang,
) => {
  await dispatch(serverLangAsyncAction(lang));
  dispatch(changeClientLang(lang));
};
