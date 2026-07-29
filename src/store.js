import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./utils/auth/authSlice";
import jobReducer from "./utils/jobs/jobSlice";
export const store = configureStore({
  reducer: {
    user: authReducer,
    jobs: jobReducer,
  },
});
