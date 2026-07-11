import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./auth-api";
import { marketApi } from "./market-api";
import { authReducer } from "./auth-slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [marketApi.reducerPath]: marketApi.reducer,
    },
    middleware: (getDefault) =>
      getDefault().concat(authApi.middleware, marketApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
