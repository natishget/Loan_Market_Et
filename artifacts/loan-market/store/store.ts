import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import loanReducer from "./slices/loanSlice";
import userReducer from "./slices/userSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loans: loanReducer,
    users: userReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
