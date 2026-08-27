import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/me");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Please login to continue!",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      await api.post("/login", credentials);

      const res = await api.get("/me");

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid credentials!",
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/register", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to register!",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/logout");
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed!");
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await api.put("/forgot-password", {
        email,
        password,
        confirmPassword,
      });

      return res.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reset password!",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    profile: null,
    status: "loading",
    error: null,
    initializing: true,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
        state.initializing = true;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "success";
        state.initializing = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.error = null;
      })

      .addCase(fetchCurrentUser.rejected, (state) => {
        ((state.status = "failed"),
          (state.user = null),
          (state.profile = null));
        state.error = null;
        state.initializing = false;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.status = "success";
        state.error = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.profile = null;
        state.error = null;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
      })

      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = "success";
        state.error = null;
      })

      .addCase(forgotPassword.rejected, (state, action) => {
        ((state.status = "failed"), (state.error = action.payload));
      })

      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        },
      )

      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") &&
          action.type.endsWith("/rejected") &&
          action.type !== fetchCurrentUser.rejected.type,
        (state, action) => {
          state.status = "failed";
          state.error = action.payload || action.error.message;
        },
      );
  },
});
export const { clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;
