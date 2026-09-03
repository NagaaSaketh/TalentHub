import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUser, CheckCircle, XCircle, Bookmark } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchApplicantDashboard } from "../../utils/applicant/applicantSlice";
const ApplicantDashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentActivity, recommendedJobs } = useSelector(
    (state) => state.applicant,
  );
  const postedAgo = (createdAt) => {
    const difference = new Date() - new Date(createdAt);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";

    return `${days}d ago`;
  };

  useEffect(() => {
    dispatch(fetchApplicantDashboard());
  }, [dispatch]);
  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-4xl font-bold">My Dashboard</h1>

        <p className="text-base-content/60 mt-2">
          Track your applications, bookmarks and job recommendations.
        </p>
      </motion.div>
      {stats.appliedJobs === 0 &&
        stats.shortlisted === 0 &&
        stats.rejected === 0 &&
        stats.bookmarked === 0 && (
          <div className="alert alert-info mt-8">
            <span>
              👋 Welcome to TalentHub! Start exploring jobs and apply to your
              first opportunity to kickstart your career.
            </span>
          </div>
        )}

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full mt-10 border border-base-300 bg-base-100">
        <div className="stat">
          <div className="stat-figure text-primary">
            <FileUser className="w-8 h-8" />
          </div>

          <div className="stat-title">Applied Jobs</div>

          <div className="stat-value">{stats.appliedJobs}</div>

          <div className="stat-desc">Applications submitted</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="stat-title">Shortlisted</div>

          <div className="stat-value">{stats.shortlisted}</div>

          <div className="stat-desc">Interview opportunities</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-error">
            <XCircle className="w-8 h-8" />
          </div>

          <div className="stat-title">Rejected</div>

          <div className="stat-value">{stats.rejected}</div>

          <div className="stat-desc">Applications rejected</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning">
            <Bookmark className="w-8 h-8" />
          </div>

          <div className="stat-title">Bookmarked</div>

          <div className="stat-value">{stats.bookmarked}</div>

          <div className="stat-desc">Saved jobs</div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-base-100 border border-base-300 shadow"
        >
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Recent Activity</h2>

            {recentActivity.length === 0 ? (
              <div className="card-body flex flex-col justify-center items-center text-center h-full min-h-87.5">
                <h3 className="text-xl font-semibold">No recent activity</h3>

                <p className="text-base-content/60 mt-2 max-w-sm">
                  Your recent job applications and interview updates will appear
                  here.
                </p>

                <Link to="/applicant" className="btn btn-primary mt-6">
                  Explore Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {recentActivity.map((app) => (
                  <div
                    key={app._id}
                    className="flex gap-4 border-b border-base-300 pb-4 last:border-0"
                  >
                    <div className="mt-1">
                      {app.status === "Applied" && (
                        <div className="w-3 h-3 rounded-full bg-info"></div>
                      )}

                      {app.status === "Shortlisted" && (
                        <div className="w-3 h-3 rounded-full bg-success"></div>
                      )}

                      {app.status === "Rejected" && (
                        <div className="w-3 h-3 rounded-full bg-error"></div>
                      )}

                      {app.status === "Withdrawn" && (
                        <div className="w-3 h-3 rounded-full bg-neutral"></div>
                      )}
                    </div>

                    <div>
                      <p className="font-medium">
                        {app.status === "Applied" &&
                          `Applied for ${app.job?.title} at ${app.job?.company}.`}

                        {app.status === "Shortlisted" &&
                          `Shortlisted for ${app.job?.title} at ${app.job?.company}.`}

                        {app.status === "Rejected" &&
                          `Your application for ${app.job?.title} at ${app.job?.company} was rejected.`}

                        {app.status === "Withdrawn" &&
                          `Withdrew your application for ${app.job?.title} at ${app.job?.company}.`}
                      </p>

                      <p className="text-sm text-base-content/50 mt-1">
                        {postedAgo(app.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card bg-base-100 border border-base-300 shadow"
        >
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-2xl">Recommended Jobs</h2>

              <Link to="/applicant/jobs" className="btn btn-link">
                View All
              </Link>
            </div>

            <div className="space-y-5">
              {recommendedJobs.length > 0 ? (
                recommendedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between border-b border-base-300 pb-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="avatar placeholder">
                        <div className="flex items-center justify-center bg-primary text-primary-content rounded-lg w-12">
                          <span className="font-bold">
                            {job.company?.charAt(0)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold">{job.title}</h3>

                        <p className="text-sm opacity-60">{job.company}</p>

                        <p className="text-xs opacity-50">{job.location}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        {job.salary?.min} - {job.salary?.max} LPA
                      </p>

                      <Link
                        to={`/applicant/job/${job._id}`}
                        className="btn btn-xs btn-primary mt-2"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <h2 className="text-xl font-medium flex justify-center items-center min-h-screen">
                  No recommendation found!
                </h2>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ApplicantDashboard;
