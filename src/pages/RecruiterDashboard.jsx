import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  Archive,
  UserCheck,
  TrendingUp,
  EllipsisVertical,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../utils/recruiter/recruiterSlice";
import { Link } from "react-router-dom";

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
        <h1 className="text-4xl font-bold">Recruiter Dashboard</h1>

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

            <Link to="/recruiter/applications" className="btn btn-link">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="table table-zebra">
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

                    
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      
      </motion.div>
    </motion.div>
  );
};

export default RecruiterDashboard;
