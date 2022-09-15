import { createRequest } from "@react-ssr-setup/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getPublicApi } from "@shared";

interface ServerLangState {
  [Key: string]: string;
}

export interface ServerLangType {
  state: "loading" | "loaded" | "initial";
  data: { [key: string]: ServerLangState };
  error: string | Error;
}

const initialState: ServerLangType = {
  state: "initial",
  data: {},
  error: "",
};

export const serverLangAsyncAction = createAsyncThunk("serverLang/asyncAction", async (lang: string) => {
  const request = createRequest({ baseURL: getPublicApi() });
  const res = await request.get<ServerLangState>(`/api/lang`, { params: { lang: lang } });
  return { [lang]: res.data };
});

export const serverLangSlice = createSlice({
  name: "serverLang",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(serverLangAsyncAction.pending, (state) => {
        state.state = "loading";
      })
      .addCase(serverLangAsyncAction.rejected, (state, action) => {
        state.state = "loaded";
        state.error = action.payload as string | Error;
      })
      .addCase(serverLangAsyncAction.fulfilled, (state, action) => {
        state.state = "loaded";
        state.data = { ...state.data, ...action.payload };
      });
  },
});
