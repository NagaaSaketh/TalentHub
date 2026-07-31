import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  fetchRecruiterApplications,
  shortlistApplicant,
  rejectApplicant,
} from "../utils/recruiter/recruiterSlice";
import { MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AllApplications = () => {
  const dispatch = useDispatch();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const isWithdrawn = selectedApplication?.status === "Withdrawn";
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { applications, status } = useSelector((state) => state.recruiter);

  const handleShortlist = async () => {
    try {
      await dispatch(shortlistApplicant(selectedApplication._id)).unwrap();

      setSuccess("Shortlisted successfully");
      setError("");

      document.getElementById("applicant_modal").close();

      dispatch(fetchRecruiterApplications());
    } catch (err) {
      setError(err);
      setSuccess("");
    }
  };

  const handleReject = async () => {
    try {
      await dispatch(rejectApplicant(selectedApplication._id)).unwrap();

      setSuccess("Rejected successfully");
      setError("");

      document.getElementById("applicant_modal").close();

      dispatch(fetchRecruiterApplications());
    } catch (err) {
      setError(err);
      setSuccess("");
    }
  };

  useEffect(() => {
    dispatch(fetchRecruiterApplications());
  }, [dispatch]);

  useEffect(() => {
    if (!success && !error) return;

    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success, error]);

  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
      <li className="p-5 flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Applications</h2>

        <span className="badge badge-info badge-soft badge-lg">
          Total Applications: {applications.length}
        </span>
      </li>
      <li className="hidden lg:grid grid-cols-6 gap-6 px-8 py-4 text-sm font-semibold text-base-content/60 border-t border-b bg-base-200">
        <span>Applicant</span>

        <span>Job</span>

        <span>Experience</span>

        <span>Applied On</span>

        <span>Status</span>

        <span className="text-center">Action</span>
      </li>

      {applications.map((application, index) => (
        <motion.li
          key={application._id}
          className="list-row"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="avatar placeholder">
            <div className="flex items-center justify-center bg-primary text-primary-content rounded-full w-12">
              <span className="font-bold">
                {application.applicant.user.fullname.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="list-col-grow">
            <div className="font-semibold">
              {application.applicant.user.fullname}
            </div>

            <div className="text-sm opacity-60">
              {application.applicant.user.email}
            </div>
          </div>

          <div className="hidden lg:block w-60">
            <div className="font-medium">{application.job.title}</div>

            <div className="text-sm opacity-60">{application.job.company}</div>
          </div>

          <div className="hidden xl:block w-32">
            {application.applicant.totalExperience} Years
          </div>

          <div className="hidden lg:block w-36">
            {new Date(application.createdAt).toLocaleDateString()}
          </div>

          <div className="w-32">
            <div
              className={`badge
            ${
              application.status === "Applied"
                ? "badge-info"
                : application.status === "Shortlisted"
                  ? "badge-success"
                  : application.status === "Rejected"
                    ? "badge-error"
                    : application.status === "Withdrawn"
                      ? "badge-warning"
                      : "badge-neutral"
            }`}
            >
              {application.status}
            </div>
          </div>

          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
              <MoreVertical size={18} />
            </button>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box shadow-lg border w-52 z-50"
            >
              <li>
                <button
                  onClick={() => {
                    setSelectedApplication(application);
                    document.getElementById("applicant_modal").showModal();
                  }}
                >
                  View Applicant
                </button>
              </li>

              {application.applicant.resume && (
                <li>
                  <a
                    href={application.applicant.resume}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Resume
                  </a>
                </li>
              )}

              {/* <li>
                <button>Shortlist</button>
              </li>

              <li>
                <button>Reject</button>
              </li> */}
            </ul>
            <dialog id="applicant_modal" className="modal">
              <div className="modal-box max-w-3xl">
                {selectedApplication && (
                  <>
                    <h3 className="font-bold text-2xl mb-6">
                      Applicant Details
                    </h3>

                    <div className="flex items-center gap-5 mb-8">
                      <div className="avatar placeholder">
                        <div className="w-20 rounded-full bg-primary text-primary-content">
                          <span className="text-3xl">
                            {selectedApplication.applicant.user.fullname
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold">
                          {selectedApplication.applicant.user.fullname}
                        </h2>

                        <p className="opacity-70">
                          {selectedApplication.applicant.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="card bg-base-200">
                        <div className="card-body p-4">
                          <h4 className="font-semibold">
                            Personal Information
                          </h4>

                          <p>
                            <strong>Location:</strong>{" "}
                            {selectedApplication.applicant.location}
                          </p>

                          <p>
                            <strong>Total Experience:</strong>{" "}
                            {selectedApplication.applicant.totalExperience}{" "}
                            Years
                          </p>

                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Experience</h4>

                            {selectedApplication.applicant.experience?.length >
                            0 ? (
                              selectedApplication.applicant.experience.map(
                                (exp) => (
                                  <div
                                    key={exp._id}
                                    className="border rounded-lg p-3 mb-3 bg-base-200"
                                  >
                                    <p>
                                      <strong>Company:</strong> {exp.company}
                                    </p>

                                    <p>
                                      <strong>Position:</strong> {exp.position}
                                    </p>
                                  </div>
                                ),
                              )
                            ) : (
                              <p className="text-base-content/60">
                                No experience added.
                              </p>
                            )}
                          </div>

                          <p>
                            <strong>Applied:</strong>{" "}
                            {new Date(
                              selectedApplication.createdAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="card bg-base-200">
                        <div className="card-body p-4">
                          <h4 className="font-semibold">Job Applied</h4>

                          <p>{selectedApplication.job.title}</p>

                          <p className="opacity-70">
                            {selectedApplication.job.company}
                          </p>

                          <p>{selectedApplication.job.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Skills</h4>

                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.applicant.skills.map((skill) => (
                          <span
                            key={skill}
                            className="badge badge-primary badge-outline"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedApplication.applicant.resume && (
                      <div className="mt-6">
                        <a
                          href={selectedApplication.applicant.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline"
                        >
                          View Resume
                        </a>
                      </div>
                    )}

                    <div className="modal-action justify-between">
                      <div className="flex gap-3">
                        <div
                          className={isWithdrawn ? "tooltip" : ""}
                          data-tip="Candidate withdrawn application"
                        >
                          <button
                            className="btn btn-success"
                            onClick={handleShortlist}
                            disabled={isWithdrawn}
                          >
                            Shortlist
                          </button>
                        </div>

                        <div
                          className={isWithdrawn ? "tooltip" : ""}
                          data-tip="Candidate withdrawn application"
                        >
                          <button
                            className="btn btn-error"
                            onClick={handleReject}
                            disabled={isWithdrawn}
                          >
                            Reject
                          </button>
                        </div>
                      </div>

                      <form method="dialog">
                        <button className="btn">Close</button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </dialog>
          </div>
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
        </motion.li>
      ))}
    </ul>
  );
};

export default AllApplications;
