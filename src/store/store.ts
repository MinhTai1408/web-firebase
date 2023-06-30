import { configureStore } from "@reduxjs/toolkit";
import authSilce from "../features/authSilce";

export const store = configureStore({
  reducer: {
    auth: authSilce,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
