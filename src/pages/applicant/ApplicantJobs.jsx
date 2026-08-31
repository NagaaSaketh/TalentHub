import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MoreVertical, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchApplications,
  withdrawJob,
  applyJob,
  fetchBookmarks,
  toggleBookmark,
} from "../../utils/applicant/applicantSlice";
import api from "../../api/axios";

const ApplicantJobs = () => {
  const dispatch = useDispatch();

  const { applications, bookmarks } = useSelector((state) => state.applicant);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState("All");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [prepData, setPrepData] = useState(null);
  const [prepLoading, setPrepLoading] = useState(false);
  const [prepError, setPrepError] = useState(null);
  const data = filter === "Bookmarked" ? bookmarks : applications;
  const handleWithdraw = async (jobId) => {
    try {
      const res = await dispatch(withdrawJob(jobId)).unwrap();
      setSuccess(res.message || "Application withdrawn successfully!");
      setError("");
      document.getElementById("job_modal").close();
      dispatch(fetchApplications(filter));
    } catch (err) {
      setError(err.message || "Failed to withdraw");
      setSuccess("");
    }
  };

  const handleApplyAgain = async (jobId) => {
    try {
      const res = await dispatch(applyJob(jobId)).unwrap();

      setSuccess(res.message);
      setError("");

      document.getElementById("job_modal").close();

      dispatch(fetchApplications(filter));
    } catch (err) {
      setError(err);
      setSuccess("");
    }
  };

  const handlePrepareInterview = async (jobId) => {
    setPrepData(null);
    setPrepError(null);
    setPrepLoading(true);
    document.getElementById("interview_prep_modal").showModal();

    try {
      const res = await api.post(`/ai/applicant/guide/${jobId}`);
      setPrepData(res.data.data);
    } catch (err) {
      setPrepError(
        err.response?.data?.message ||
          "Unable to generate interview prep right now.",
      );
    } finally {
      setPrepLoading(false);
    }
  };

  const handleRemoveBookmark = async (jobId) => {
    try {
      const res = await dispatch(toggleBookmark(jobId)).unwrap();
      setSuccess(res.message || "Bookmark removed successfully!");
      setError("");

      document.getElementById("job_modal").close();

      dispatch(fetchBookmarks());
    } catch (err) {
      setError(err);
      setSuccess("");
    }
  };

  useEffect(() => {
    if (!success && !error) return;

    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success, error]);

  useEffect(() => {
    if (filter === "Bookmarked") {
      dispatch(fetchBookmarks());
    } else {
      dispatch(fetchApplications(filter));
    }
  }, [dispatch, filter]);

  return (
    <>
      <div className="card bg-base-100 shadow-xl w-full">
        <div className="card-body p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6 sm:mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                {filter === "Bookmarked" ? "Bookmarked Jobs" : "Applied Jobs"}
              </h2>
              <p className="mt-2 text-base-content/60 text-sm sm:text-base lg:text-lg">
                {filter === "Bookmarked"
                  ? "Jobs you've saved for later."
                  : "Track the progress of your job applications."}
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <select
                  className="select select-bordered w-full sm:w-56"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                  <option value="Bookmarked">Bookmarked</option>
                </select>

                <div className="stats shadow w-full sm:w-auto">
                  <div className="stat px-4 sm:px-6 py-3">
                    <div className="stat-title">Applications</div>
                    <div className="stat-value text-primary">{data.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-base-300">
            <table className="table table-zebra min-w-175">
              <thead className="bg-base-200">
                <tr>
                  <th>Job</th>
                  <th>Salary</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="text-base-content/60">
                        No {filter !== "All" ? filter.toLowerCase() : ""}{" "}
                        applications found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((application) => (
                    <tr key={application._id} className="hover">
                      <td>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="avatar placeholder">
                            <div className="flex items-center justify-center bg-primary text-primary-content rounded-xl w-10 h-10 sm:w-12 sm:h-12">
                              <span className="font-bold">
                                {application.job.company.charAt(0)}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="font-bold text-sm sm:text-base">
                              {application.job.title}
                            </div>

                            <div className="text-xs sm:text-sm opacity-60">
                              {application.job.company}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        ₹{application.job.salary.min / 100000} - ₹
                        {application.job.salary.max / 100000} LPA
                      </td>

                      <td>
                        {filter === "Bookmarked"
                          ? "-"
                          : new Date(application.createdAt).toLocaleDateString(
                              "en-GB",
                            )}
                      </td>

                      <td>
                        {filter === "Bookmarked" ? (
                          <div className="badge badge-secondary">
                            Bookmarked
                          </div>
                        ) : (
                          <div
                            className={`badge badge-md ${
                              application.status === "Applied"
                                ? "badge-info"
                                : application.status === "Shortlisted"
                                  ? "badge-success"
                                  : application.status === "Rejected"
                                    ? "badge-error"
                                    : "badge-warning"
                            }`}
                          >
                            {application.status}
                          </div>
                        )}
                      </td>

                      <td className="text-center sm:text-right">
                        <div className="dropdown dropdown-end">
                          <button className="btn btn-ghost btn-sm btn-circle min-w-10 min-h-10">
                            <MoreVertical size={18} />
                          </button>

                          <ul className="dropdown-content font-semibold z-50 menu p-2 shadow bg-base-100 rounded-box w-56">
                            <li>
                              <button
                                onClick={() => {
                                  setSelectedApplication(application);
                                  document
                                    .getElementById("job_modal")
                                    .showModal();
                                }}
                              >
                                View Application Details
                              </button>
                            </li>
                            {(application.status === "Applied" ||
                              application.status === "Shortlisted") && (
                              <li>
                                <button
                                  onClick={() =>
                                    handlePrepareInterview(application.job._id)
                                  }
                                  className="btn btn-ghost justify-between w-full hover:bg-violet-50 transition-all"
                                >
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-violet-600" />
                                    <span className="font-medium bg-linear-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                                      Interview Coach
                                    </span>
                                  </div>

                                  <span className="badge badge-secondary badge-xs animate-pulse">
                                    AI
                                  </span>
                                </button>
                              </li>
                            )}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <dialog id="job_modal" className="modal">
        <div className="modal-box max-w-3xl">
          <h3 className="text-2xl font-bold mb-6">
            {selectedApplication?.job.title}
          </h3>

          <div className="space-y-3">
            <p>
              <span className="font-semibold">Company:</span>{" "}
              {selectedApplication?.job.company}
            </p>

            <p>
              <span className="font-semibold">Location:</span>{" "}
              {selectedApplication?.job.location}
            </p>

            <p>
              <span className="font-semibold">Salary: </span>
              {selectedApplication?.job.salary?.min / 100000} -
              {selectedApplication?.job.salary?.max / 100000} LPA
            </p>

            <p>
              <span className="font-semibold">Required Experience:</span>{" "}
              {selectedApplication?.job.requiredExp} Years
            </p>

            <div>
              <h4 className="font-semibold mb-2">Required Skills</h4>

              <div className="flex flex-wrap gap-2">
                {selectedApplication?.job.skills?.map((skill) => (
                  <span key={skill} className="badge badge-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Job Description</h4>

              <p>{selectedApplication?.job.description}</p>
            </div>
          </div>

          <div className="modal-action justify-between">
            {filter === "Bookmarked" && (
              <button
                className="btn btn-error"
                onClick={() =>
                  handleRemoveBookmark(selectedApplication.job._id)
                }
              >
                Remove Bookmark
              </button>
            )}
            {selectedApplication?.status === "Applied" && (
              <button
                onClick={() => handleWithdraw(selectedApplication.job._id)}
                className="btn btn-error"
              >
                Withdraw Application
              </button>
            )}

            {selectedApplication?.status === "Withdrawn" && (
              <button
                className="btn btn-info"
                onClick={() => handleApplyAgain(selectedApplication.job._id)}
              >
                Apply Again
              </button>
            )}

            {selectedApplication?.status === "Shortlisted" && (
              <button className="btn btn-success" disabled>
                You're Shortlisted
              </button>
            )}

            {selectedApplication?.status === "Rejected" && (
              <button className="btn btn-disabled" disabled>
                Application Closed
              </button>
            )}

            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="interview_prep_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-2xl mb-4">✨ Interview Preparation</h3>

          {prepLoading && (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg" />
            </div>
          )}

          {prepError && (
            <div role="alert" className="alert alert-error text-sm">
              <span>{prepError}</span>
            </div>
          )}

          {prepData && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Interview Questions</h4>
                <ol className="list-decimal list-inside space-y-1">
                  {prepData.questions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Topics to Revise</h4>
                <div className="flex flex-wrap gap-2">
                  {prepData.topicsToRevise.map((topic, i) => (
                    <span key={i} className="badge badge-primary">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Preparation Tips</h4>
                <ul className="list-disc list-inside space-y-1 opacity-80">
                  {prepData.preparationTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <AnimatePresence>
        {success && (
          <div className="toast toast-top toast-center z-50">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="alert alert-success"
            >
              <span>{success}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <div className="toast toast-top toast-center z-50">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="alert alert-error shadow-lg"
            >
              <span>{error}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ApplicantJobs;
