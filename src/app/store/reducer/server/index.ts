import { combineReducers } from '@reduxjs/toolkit'

import { serverLangSlice } from './serverLang';
import { serverPropsSlice } from './serverProps';

export const server = combineReducers({
  [serverLangSlice.name]: serverLangSlice.reducer,
  [serverPropsSlice.name]: serverPropsSlice.reducer,
});
