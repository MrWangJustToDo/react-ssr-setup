import { combineReducers } from '@reduxjs/toolkit'

import { clientLangSlice } from './clientLang';
import { clientPropsSlice } from './clientProps';

export { clientPropsSlice } from './clientProps';
export { clientLangSlice } from './clientLang';

export const client = combineReducers({
  [clientLangSlice.name]: clientLangSlice.reducer,
  [clientPropsSlice.name]: clientPropsSlice.reducer,
});
