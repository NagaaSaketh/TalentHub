import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchAllJobs = createAsyncThunk(
  "jobs/fetchAllJobs",
  async ({ filters = "", search = "" }, { rejectWithValue }) => {
    try {
      let query = filters;

      if (search.trim()) {
        query += `${query ? "&" : ""}search=${encodeURIComponent(search)}`;
      }

      const res = await api.get(`/jobs?${query}`);

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

export const fetchApplications = createAsyncThunk(
  "jobs/applications",
  async (status = "All", { rejectWithValue }) => {
    try {
      const res = await api.get(`/applications?status=${status}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applications",
      );
    }
  },
);

export const fetchBookmarks = createAsyncThunk(
  "applicant/fetchBookmarks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/jobs/bookmarks");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch bookmarked jobs",
      );
    }
  },
);

export const toggleBookmark = createAsyncThunk(
  "applicant/toggleBookmark",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/jobs/${jobId}/bookmark`);
      return {
        jobId,
        message: res.data.message,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const updateApplicantProfile = createAsyncThunk(
  "applicant/update",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.patch("/applicant/profile", formData);

      return res.data.applicant;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const uploadApplicantPhoto = createAsyncThunk(
  "applicant/photo",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.patch("/applicant/profile/photo", data);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const uploadResume = createAsyncThunk(
  "applicant/resume",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.patch("/applicant/profile/resume", data);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

const applicantsSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    selectedJob: null,
    hasApplied: false,
    hasResume: false,
    stats: {},
    search: "",
    recentActivity: [],
    recommendedJobs: [],
    applications: [],
    bookmarks: [],
    hasBookmarked: false,
    recruiterProfile: null,
    similarJobs: [],
    bookmarks: [],
    applicantsCount: 0,
    status: "idle",
    error: null,
  },
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.status = "success";
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.status = "failed";
        state.jobs = [];
        state.error = action.payload;
      })

      .addCase(fetchJobDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.status = "success";
        state.selectedJob = action.payload.job;
        state.applicantsCount = action.payload.applicantsCount;
        state.recruiterProfile = action.payload.recruiterProfile;
        state.similarJobs = action.payload.similarJobs;
        state.hasApplied = action.payload.hasApplied;
        state.hasBookmarked = action.payload.hasBookmarked;
        state.hasResume = action.payload.hasResume;

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
      })

      .addCase(fetchApplications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = "success";
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = "failed";
        state.applications = [];
        state.error = action.payload;
      })

      .addCase(fetchBookmarks.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload;
        state.error = null;
      })

      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.stats = "loading";
        state.error = action.payload;
      })

      .addCase(toggleBookmark.pending, (state) => {
        state.status = "loading";
      })

      .addCase(toggleBookmark.fulfilled, (state, action) => {
        state.bookmarks = state.bookmarks.filter(
          (bookmark) => bookmark.job._id !== action.payload.jobId,
        );
      })

      .addCase(toggleBookmark.rejected, (state, action) => {
        ((state.status = "failed"), (state.error = action.payload));
      });
  },
});
export const { setSearch } = applicantsSlice.actions;
export default applicantsSlice.reducer;
