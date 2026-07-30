import { motion } from "framer-motion";
import { Briefcase, Users, Archive, UserCheck, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../utils/recruiter/recruiterSlice";

const RecruiterDashboard = () => {
  const dispatch = useDispatch();

  const { stats, recentApplications } = useSelector((state) => state.recruiter);

  console.log(stats);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);
  console.log(recentApplications);

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
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>

        <p className="text-base-content/60 mt-2">
          Manage jobs, monitor applications and hire top talent.
        </p>
      </motion.div>

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full mt-10 border border-base-300 bg-base-100">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Briefcase className="w-8 h-8" />
          </div>

          <div className="stat-title">Active Jobs</div>

          <div className="stat-value">{stats.activeJobs}</div>

          <div className="stat-desc">Currently accepting applications</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <Users className="w-8 h-8" />
          </div>

          <div className="stat-title">Applications</div>

          <div className="stat-value">{stats.totalApplications}</div>

          <div className="stat-desc">Total received</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <UserCheck className="w-8 h-8" />
          </div>

          <div className="stat-title">Shortlisted</div>

          <div className="stat-value">{stats.shortlisted}</div>

          <div className="stat-desc">Candidates shortlisted</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning">
            <Archive className="w-8 h-8" />
          </div>

          <div className="stat-title">Archived Jobs</div>

          <div className="stat-value">{stats.archivedJobs}</div>

          <div className="stat-desc">No longer accepting applications</div>
        </div>
      </div>
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.5,
        }}
        className="card bg-base-100 border border-base-300 shadow-sm mt-10"
      >
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Recent Applications</h2>

            <button
              className="btn btn-link"
              onClick={() =>
                document.getElementById("applications_modal").showModal()
              }
            >
              View all
            </button>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Job</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {recentApplications.map((app, index) => (
                  <motion.tr
                    key={app._id}
                    initial={{
                      opacity: 0,
                      x: 30,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: index * 0.08,
                    }}
                  >
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="avatar placeholder">
                          <div className="flex items-center justify-center bg-primary text-primary-content rounded-full w-12">
                            <span className="font-bold">
                              {app.applicant?.user?.fullname?.charAt(0)}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="font-semibold">
                            {app.applicant?.user?.fullname}
                          </div>

                          <div className="text-sm opacity-60">
                            {app.applicant?.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="font-medium">{app.job?.title}</td>

                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>

                    <td>
                      {app.status === "Applied" && (
                        <div className="badge badge-info">Applied</div>
                      )}

                      {app.status === "Shortlisted" && (
                        <div className="badge badge-success">Shortlisted</div>
                      )}

                      {app.status === "Rejected" && (
                        <div className="badge badge-error">Rejected</div>
                      )}

                      {app.status === "Withdrawn" && (
                        <div className="badge badge-neutral">Withdrawn</div>
                      )}
                    </td>

                    <td>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-ghost btn-sm"
                        >
                          ⋮
                        </div>

                        <ul
                          tabIndex={0}
                          className="dropdown-content menu bg-base-100 rounded-box shadow-lg border w-48 z-50"
                        >
                          <li>
                            <a>View Profile</a>
                          </li>
                          <li>
                            <a className="text-error">Reject</a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <dialog id="applications_modal" className="modal">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-2xl mb-6">All Applications</h3>

            <ul className="list bg-base-100 rounded-box">
              <li className="p-4 pb-2 text-sm opacity-60 tracking-wide">
                Total Applications ({recentApplications.length})
              </li>

              {recentApplications.map((app) => (
                <li
                  key={app._id}
                  className="list-row flex items-center justify-between"
                >
                  <div className="avatar placeholder">
                    <div className="flex items-center justify-center bg-primary text-primary-content rounded-full w-12">
                      <span className="font-bold">
                        {app.applicant?.user?.fullname?.charAt(0)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 ml-4">
                    <div className="font-semibold">
                      {app.applicant?.user?.fullname}
                    </div>

                    <div className="text-xs opacity-60">{app.job?.title}</div>
                  </div>

                  <div className="text-sm">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </div>

                  <div>
                    {app.status === "Applied" && (
                      <div className="badge badge-info">Applied</div>
                    )}

                    {app.status === "Shortlisted" && (
                      <div className="badge badge-success">Shortlisted</div>
                    )}

                    {app.status === "Rejected" && (
                      <div className="badge badge-error">Rejected</div>
                    )}

                    {app.status === "Withdrawn" && (
                      <div className="badge badge-neutral">Withdrawn</div>
                    )}
                  </div>

                  <button className="btn btn-sm btn-primary">View</button>
                </li>
              ))}
            </ul>

            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </motion.div>
    </motion.div>
  );
};

export default RecruiterDashboard;
