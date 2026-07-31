import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./utils/auth/authSlice";
import applicantReducer from "./utils/applicant/applicantSlice";
import recruiterReducer from "./utils/recruiter/recruiterSlice";
export const store = configureStore({
  reducer: {
    user: authReducer,
    applicant: applicantReducer,
    recruiter: recruiterReducer,
  },
});
