import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

interface ClientPropsState {
  [key: string]: Record<string, unknown>;
}

export interface ClientPropsType {
  state: "loading" | "loaded" | "initial";
  data: ClientPropsState;
  error: string | Error;
}

const initialState: ClientPropsType = { state: "initial", data: {}, error: "" };

const clientPropsSlice = createSlice({
  name: "clientProps",
  initialState,
  reducers: {
    changeClientPropsStart(state) {
      state.state = "loading";
    },
    changeClientPropsSuccess(state, action: PayloadAction<ClientPropsState>) {
      state.state = "loaded";
      state.data = { ...state.data, ...action.payload };
    },
    changeClientPropsFailed(state, action) {
      state.state = "loaded";
      state.error = action.payload;
    },
  },
});

export const { changeClientPropsStart, changeClientPropsSuccess, changeClientPropsFailed } = clientPropsSlice.actions;

export { clientPropsSlice };
