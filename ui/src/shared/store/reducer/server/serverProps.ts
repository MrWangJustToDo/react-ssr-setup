import { createRequest } from "@react-ssr-setup/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getPublicApi } from "@shared";

interface ServerPropsState {
  [key: string]: unknown;
}

export interface ServerPropsType {
  state: "loading" | "loaded" | "initial";
  data: ServerPropsState;
  error: string | Error;
}

const initialState: ServerPropsType = {
  state: "initial",
  data: {},
  error: "",
};

// TODO should we need all the getServerSideProps and getClientSideProps for page component
export const serverPropsAsyncAction = createAsyncThunk(
  "serverProps/asyncAction",
  async ({ query, preloadPage }: { preloadPage: string; query: URLSearchParams }) => {
    const request = createRequest({ baseURL: getPublicApi() });
    const res = await request.get<string, Record<string, string>>(`/api/preload`, {
      params: {
        page: preloadPage,
        ...query,
      },
    });
    return res;
  }
);

export const serverPropsSlice = createSlice({
  name: "serverProps",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(serverPropsAsyncAction.pending, (state) => {
        state.state = "loading";
      })
      .addCase(serverPropsAsyncAction.rejected, (state, action) => {
        state.state = "loaded";
        state.error = action.payload as Error;
      })
      .addCase(serverPropsAsyncAction.fulfilled, (state, action) => {
        state.state = "loaded";
        state.data = action.payload;
      });
  },
});
