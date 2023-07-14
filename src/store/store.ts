import { configureStore } from "@reduxjs/toolkit";
import authSilce from "../features/authSilce";

import booksReducer from "../features/deviceSlice";
import serviceReducer from "../features/serviceSlice";
import accountsReducer from "../features/accountsSlice";
export const store = configureStore({
  reducer: {
    auth: authSilce,
    books: booksReducer,
    service: serviceReducer,
    accounts: accountsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
