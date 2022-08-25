import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slices/user";
import configSlice from "./slices/config";
import web3Slice from "./slices/web3";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    config: configSlice.reducer,
    web3: web3Slice.reducer
  }
});

export type TrState = ReturnType<typeof store.getState>;
export type TrDispatch = typeof store.dispatch;
