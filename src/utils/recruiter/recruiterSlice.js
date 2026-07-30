import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const createJobs = createAsyncThunk(
  "recruiter/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const res = await api.post("/jobs", jobData);

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create job",
      );
    }
  },
);

export const fetchDashboard = createAsyncThunk(
  "recruiter/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/dashboard");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard",
      );
    }
  },
);

export const fetchJobsByRecruiter = createAsyncThunk(
  "recruiter/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/jobs");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to get jobs",
      );
    }
  },
);

const recruiterSlice = createSlice({
  name: "recruiter",

  initialState: {
    jobs: [],
    stats: {},
    recentApplications: [],
    status: "idle",
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(createJobs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createJobs.fulfilled, (state, action) => {
        state.status = "success";
        state.jobs.push(action.payload.job);
      })
      .addCase(createJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchJobsByRecruiter.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJobsByRecruiter.fulfilled, (state, action) => {
        state.status = "success";
        state.jobs = action.payload;
      })
      .addCase(fetchJobsByRecruiter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "success";
        state.stats = action.payload.stats;
        state.recentApplications = action.payload.recentApplications;
      })

      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default recruiterSlice.reducer;
