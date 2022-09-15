import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

export interface ClientLangState {
  value: string;
}

const initialState: ClientLangState = { value: "" };

const clientLangSlice = createSlice({
  name: "clientLang",
  initialState,
  reducers: {
    changeClientLang(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
  },
});

export const { changeClientLang } = clientLangSlice.actions;

export { clientLangSlice };
