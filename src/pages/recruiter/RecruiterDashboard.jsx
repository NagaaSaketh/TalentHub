import { motion } from "framer-motion";
import { Briefcase, Users, Archive, UserCheck } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../utils/recruiter/recruiterSlice";
import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
  const dispatch = useDispatch();

  const { stats, recentApplications } = useSelector((state) => state.recruiter);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <motion.main
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold">Recruiter Dashboard</h1>

        <p className="text-sm sm:text-base text-base-content/60 mt-2">
          Manage jobs, monitor applications and hire top talent.
        </p>
      </motion.div>

      {stats.activeJobs === 0 &&
        stats.totalApplications === 0 &&
        stats.shortlisted === 0 &&
        stats.archivedJobs === 0 && (
          <div className="alert alert-info mt-6 sm:mt-8">
            <span className="text-sm sm:text-base">
              👋 Welcome to TalentHub! Publish your first job posting to start
              receiving applications from talented candidates.
            </span>
          </div>
        )}

      <div className="stats stats-vertical lg:stats-horizontal w-full mt-6 sm:mt-10 border border-base-300 bg-base-100 shadow-sm">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Briefcase className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div className="stat-title text-sm">Active Jobs</div>

          <div className="stat-value text-3xl sm:text-4xl">
            {stats.activeJobs}
          </div>

          <div className="stat-desc text-xs sm:text-sm">
            Currently accepting applications
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <Users className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div className="stat-title text-sm">Applications</div>

          <div className="stat-value text-3xl sm:text-4xl">
            {stats.totalApplications}
          </div>

          <div className="stat-desc text-xs sm:text-sm">Total received</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <UserCheck className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div className="stat-title text-sm">Shortlisted</div>

          <div className="stat-value text-3xl sm:text-4xl">
            {stats.shortlisted}
          </div>

          <div className="stat-desc text-xs sm:text-sm">
            Candidates shortlisted
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning">
            <Archive className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div className="stat-title text-sm">Archived Jobs</div>

          <div className="stat-value text-3xl sm:text-4xl">
            {stats.archivedJobs}
          </div>

          <div className="stat-desc text-xs sm:text-sm">
            No longer accepting applications
          </div>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-base-100 border border-base-300 shadow-sm mt-6 sm:mt-10"
      >
        <div className="card-body p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Recent Applications
            </h2>

            <Link
              to="/recruiter/applications"
              className="btn btn-link btn-sm sm:btn-md self-start sm:self-auto px-0"
            >
              View All
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <h3 className="text-xl sm:text-2xl font-semibold">
                No applications yet
              </h3>

              <p className="text-sm sm:text-base text-base-content/60 mt-3 max-w-md">
                Applications from candidates will appear here once they apply to
                your published jobs.
              </p>

              {stats.activeJobs === 0 ? (
                <Link
                  to="/recruiter/publish-job"
                  className="btn btn-primary mt-6"
                >
                  Publish Your First Job
                </Link>
              ) : (
                <Link to="/recruiter/jobs" className="btn btn-primary mt-6">
                  View Your Jobs
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="block lg:hidden mt-4 space-y-3">
                {recentApplications.map((app, index) => (
                  <motion.div
                    key={app._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="card bg-base-200 border border-base-300"
                  >
                    <div className="card-body p-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="avatar placeholder shrink-0">
                          <div className="flex items-center justify-center bg-primary text-primary-content rounded-full w-11 h-11">
                            <span className="font-bold">
                              {app.applicant?.user?.fullname
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate">
                            {app.applicant?.user?.fullname}
                          </p>

                          <p className="text-sm text-base-content/60 truncate">
                            {app.applicant?.user?.email}
                          </p>
                        </div>
                      </div>

                      <div className="divider my-1" />
                      <div>
                        <p className="text-xs text-base-content/50">Job</p>

                        <p className="font-medium wrap-break-word">
                          {app.job?.title}
                        </p>

                        {app.job?.company && (
                          <p className="text-sm text-base-content/60">
                            {app.job.company}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                        <div>
                          <p className="text-xs text-base-content/50">
                            Applied
                          </p>

                          <p className="text-sm">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          {app.status === "Applied" && (
                            <span className="badge badge-info">Applied</span>
                          )}

                          {app.status === "Shortlisted" && (
                            <span className="badge badge-success">
                              Shortlisted
                            </span>
                          )}

                          {app.status === "Rejected" && (
                            <span className="badge badge-error">Rejected</span>
                          )}

                          {app.status === "Withdrawn" && (
                            <span className="badge badge-neutral">
                              Withdrawn
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="hidden lg:block overflow-x-auto mt-6">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Job</th>
                      <th>Applied</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentApplications.map((app, index) => (
                      <motion.tr
                        key={app._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.06,
                        }}
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder shrink-0">
                              <div className="flex items-center justify-center bg-primary text-primary-content rounded-full w-11 h-11">
                                <span className="font-bold">
                                  {app.applicant?.user?.fullname
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                                </span>
                              </div>
                            </div>

                            <div className="min-w-0">
                              <div className="font-semibold">
                                {app.applicant?.user?.fullname}
                              </div>

                              <div className="text-sm text-base-content/60">
                                {app.applicant?.user?.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="font-medium">{app.job?.title}</div>

                          <div className="text-sm text-base-content/60">
                            {app.job?.company}
                          </div>
                        </td>

                        <td className="whitespace-nowrap">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>

                        <td>
                          {app.status === "Applied" && (
                            <span className="badge badge-info">Applied</span>
                          )}

                          {app.status === "Shortlisted" && (
                            <span className="badge badge-success">
                              Shortlisted
                            </span>
                          )}

                          {app.status === "Rejected" && (
                            <span className="badge badge-error">Rejected</span>
                          )}

                          {app.status === "Withdrawn" && (
                            <span className="badge badge-neutral">
                              Withdrawn
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </motion.section>
    </motion.main>
  );
};

export default RecruiterDashboard;
