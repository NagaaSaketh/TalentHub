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
  "recruiter/jobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/recruiter-jobs");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch recruiter jobs",
      );
    }
  },
);

export const fetchRecruiterApplications = createAsyncThunk(
  "recruiter/applications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/job-applications");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applications",
      );
    }
  },
);

export const shortlistApplicant = createAsyncThunk(
  "recruiter/shortlistApplicant",
  async (applicationId, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/${applicationId}/shortlist`);

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to shortlist applicant",
      );
    }
  },
);

export const rejectApplicant = createAsyncThunk(
  "recruiter/rejectApplicant",
  async (applicationId, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/${applicationId}/reject`);

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reject applicant",
      );
    }
  },
);

export const updateJob = createAsyncThunk(
  "recruiter/updateJob",
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/jobs/${id}`, jobData);

      return res.data.job;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update job",
      );
    }
  },
);

export const archiveJob = createAsyncThunk(
  "recruiter/archiveJob",
  async ({ id, isArchived }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/jobs/${id}/archive`, {
        isArchived,
      });

      return res.data.job;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to archive job",
      );
    }
  },
);

export const fetchArchivedJobs = createAsyncThunk(
  "recruiter/fetchArchivedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/archived-jobs`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch archive jobs",
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
    applications: [],
    archivedJobs: [],
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
      })

      .addCase(fetchRecruiterApplications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchRecruiterApplications.fulfilled, (state, action) => {
        state.applications = action.payload;
      })

      .addCase(fetchRecruiterApplications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(shortlistApplicant.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(shortlistApplicant.fulfilled, (state, action) => {
        const index = state.applications.findIndex(
          (app) => app._id === action.payload.application._id,
        );

        if (index !== -1) {
          state.applications[index].status = action.payload.application.status;
        }
      })

      .addCase(shortlistApplicant.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(rejectApplicant.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(rejectApplicant.fulfilled, (state, action) => {
        const index = state.applications.findIndex(
          (app) => app._id === action.payload.application._id,
        );

        if (index !== -1) {
          state.applications[index] = action.payload.application;
        }
      })
      .addCase(rejectApplicant.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(updateJob.pending, (state) => {
        state.status = "loading";
      })

      .addCase(updateJob.fulfilled, (state, action) => {
        state.status = "success";

        state.jobs = state.jobs.map((job) =>
          job._id === action.payload._id ? action.payload : job,
        );
      })

      .addCase(updateJob.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(archiveJob.pending, (state) => {
        state.status = "loading";
      })

      .addCase(archiveJob.fulfilled, (state, action) => {
        state.status = "success";

        state.jobs = state.jobs.map((job) =>
          job._id === action.payload._id ? action.payload : job,
        );
      })

      .addCase(archiveJob.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchArchivedJobs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchArchivedJobs.fulfilled, (state, action) => {
        state.status = "success";
        state.archivedJobs = action.payload;
      })

      .addCase(fetchArchivedJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default recruiterSlice.reducer;
