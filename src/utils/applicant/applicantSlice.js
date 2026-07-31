import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchAllJobs = createAsyncThunk(
  "jobs/fetchAllJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/jobs");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch jobs",
      );
    }
  },
);

export const fetchJobDetails = createAsyncThunk(
  "jobs/details",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/jobs/${jobId}/details`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch job details",
      );
    }
  },
);

export const applyJob = createAsyncThunk(
  "jobs/apply",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/jobs/${jobId}/apply`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to apply ");
    }
  },
);

export const withdrawJob = createAsyncThunk(
  "jobs/withdraw",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.put(`/jobs/${jobId}/withdraw`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to withdraw job",
      );
    }
  },
);

export const bookMarkJob = createAsyncThunk(
  "jobs/bookmark",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/jobs/${jobId}/bookmark`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to bookmark job",
      );
    }
  },
);
export const fetchApplicantDashboard = createAsyncThunk(
  "applicant/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/applicant-dashboard");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard",
      );
    }
  },
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    selectedJob: null,
    hasApplied: false,
    stats: {},
    recentActivity: [],
    recommendedJobs: [],
    applications: [],
    bookmarks: [],
    hasBookmarked: false,
    recruiterProfile: null,
    similarJobs: [],
    applicantsCount: 0,
    status: "loading",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        ((state.status = "success"),
          (state.jobs = action.payload),
          (state.error = null));
      })
      .addCase(fetchAllJobs.rejected, (state) => {
        ((state.status = "failed"), (state.jobs = []));
        state.error = null;
      })

      .addCase(fetchJobDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        (((state.status = "success"),
        (state.selectedJob = action.payload.job),
        (state.applicantsCount = action.payload.applicantsCount),
        (state.recruiterProfile = action.payload.recruiterProfile),
        (state.similarJobs = action.payload.similarJobs),
        (state.hasApplied = action.payload.hasApplied)),
          (state.hasBookmarked = action.payload.hasBookmarked));
        state.error = null;
      })

      .addCase(fetchJobDetails.rejected, (state, action) => {
        ((state.status = "failed"), (state.jobs = []));
        state.error = action.payload;
      })

      .addCase(fetchApplicantDashboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchApplicantDashboard.fulfilled, (state, action) => {
        state.status = "success";
        state.stats = action.payload.stats;
        state.recentActivity = action.payload.recentActivity;
        state.recommendedJobs = action.payload.recommendedJobs;
      })

      .addCase(fetchApplicantDashboard.rejected, (state, action) => {
        ((state.status = "failed"), (state.jobs = []));
        state.error = action.payload;
      });
  },
});

export default jobSlice.reducer;
