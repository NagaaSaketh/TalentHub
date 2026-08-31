import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  fetchRecruiterApplications,
  shortlistApplicant,
  rejectApplicant,
} from "../../utils/recruiter/recruiterSlice";
import { MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../../api/axios";

const AllApplications = () => {
  const dispatch = useDispatch();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const isWithdrawn = selectedApplication?.status === "Withdrawn";
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { applications, status } = useSelector((state) => state.recruiter);

  console.log(applications);

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

  const handleAskAI = async () => {
    if (!prompt.trim()) return;

    const question = prompt;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setPrompt("");
    setLoading(true);

    try {
      const res = await api.post("/ai/recruiter/chat", {
        prompt: question,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.answer,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err.response?.data?.message || "AI is unavailable.",
        },
      ]);
    }

    setLoading(false);
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
    <ul className="list bg-base-100 rounded-box shadow-md w-full overflow-hidden">
      <li className="p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">All Applications</h2>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="badge badge-info badge-lg">
            Total Applications: {applications.length}
          </div>
          <div className="aura aura-gold">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => document.getElementById("ai_modal").showModal()}
            >
              ✨ AI Assistant
            </button>
          </div>
        </div>
      </li>

      <li className="hidden lg:grid grid-cols-6 gap-4 xl:gap-6 px-4 xl:px-8 py-4 text-sm font-semibold text-base-content/60 border-t border-b bg-base-200">
        <span>Applicant</span>

        <span>Job</span>

        <span>Experience</span>

        <span>Applied On</span>

        <span>Status</span>

        <span className="text-center">Action</span>
      </li>

      {applications.length === 0 ? (
        <li className="py-16 sm:py-20 px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-xl sm:text-2xl font-bold">
              No applications yet
            </h3>

            <p className="text-sm sm:text-base text-base-content/60 max-w-md mt-3">
              Once candidates start applying to your job postings, their
              applications will appear here. You can review resumes, shortlist
              candidates, and manage hiring from this page.
            </p>

            <button
              className="btn btn-primary mt-6"
              onClick={() => (window.location.href = "/recruiter/publish-job")}
            >
              Publish Your First Job
            </button>
          </div>
        </li>
      ) : (
        applications.map((application, index) => (
          <motion.li
            key={application._id}
            className="flex flex-col gap-4 p-4 sm:p-5 lg:grid lg:grid-cols-6 lg:items-center lg:gap-4 xl:gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center gap-3 min-w-0 lg:col-span-1">
              <div className="avatar placeholder shrink-0">
                <div className="flex items-center justify-center bg-primary text-primary-content rounded-full w-10 h-10 sm:w-12 sm:h-12">
                  <span className="font-bold">
                    {application.applicant.user.fullname
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <div className="font-semibold truncate">
                  {application.applicant.user.fullname}
                </div>

                <div className="text-sm opacity-60 truncate max-w-45 sm:max-w-62.5">
                  {application.applicant.user.email}
                </div>
              </div>
            </div>

            <div className="list-col-grow lg:hidden">
              <div className="text-xs opacity-60 mb-1">Job</div>

              <div className="font-semibold truncate">
                {application.job.title}
              </div>

              <div className="text-sm opacity-60 truncate">
                {application.job.company}
              </div>
            </div>

            <div className="hidden lg:block min-w-0">
              <div className="font-medium truncate">
                {application.job.title}
              </div>

              <div className="text-sm opacity-60 truncate">
                {application.job.company}
              </div>
            </div>

            <div className="flex lg:block justify-between items-center">
              <span className="text-sm opacity-60 lg:hidden">Experience</span>

              <div className="lg:w-32">
                {application.applicant.totalExperience} Years
              </div>
            </div>

            <div className="flex lg:block justify-between items-center">
              <span className="text-sm opacity-60 lg:hidden">Applied On</span>

              <div className="lg:w-36">
                {new Date(application.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center justify-between lg:block">
              <div>
                <span className="text-sm opacity-60 lg:hidden mr-2">
                  Status:
                </span>

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
            </div>

            <div className="dropdown dropdown-end self-end lg:self-auto lg:justify-self-center">
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
              </ul>

              <dialog id="applicant_modal" className="modal">
                <div className="modal-box w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto">
                  {selectedApplication && (
                    <>
                      <h3 className="font-bold text-xl sm:text-2xl mb-6">
                        Applicant Details
                      </h3>

                      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 mb-8">
                        <div className="avatar placeholder shrink-0">
                          <div className="w-16 h-16 flex items-center justify-center rounded-full shadow-lg bg-primary text-primary-content">
                            <span className="text-2xl font-bold">
                              {selectedApplication.applicant.user.fullname
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl sm:text-2xl font-bold wrap-break-word">
                            {selectedApplication.applicant.user.fullname}
                          </h2>

                          <p className="text-base-content/60 break-all">
                            {selectedApplication.applicant.user.email}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="badge badge-outline">
                              Experience:{" "}
                              {selectedApplication.applicant.totalExperience > 0
                                ? `${selectedApplication.applicant.totalExperience} years`
                                : "Not provided"}
                            </span>

                            {selectedApplication.applicant.location && (
                              <span className="badge badge-outline">
                                {selectedApplication.applicant.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`grid gap-5 ${
                          selectedApplication.applicant.experience?.length > 0
                            ? "md:grid-cols-2"
                            : "grid-cols-1"
                        }`}
                      >
                        <div className="card bg-base-200 border border-base-300">
                          <div className="card-body p-4 sm:p-5">
                            <h3 className="card-title">Job Applied</h3>

                            <div className="lg:col-span-1 min-w-0">
                              <div className="font-medium truncate">
                                {application.job.title}
                              </div>

                              <div className="text-sm opacity-60 truncate">
                                {application.job.company}
                              </div>
                            </div>

                            <div className="divider my-2"></div>

                            <div>
                              <p className="text-sm opacity-60">Applied On</p>

                              <div>
                                {new Date(
                                  application.createdAt,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {selectedApplication.applicant.experience?.length >
                          0 && (
                          <div className="card bg-base-200 border border-base-300">
                            <div className="card-body p-4 sm:p-5">
                              <div className="flex items-center justify-between gap-3">
                                <h3 className="card-title">Experience</h3>

                                <span className="badge badge-primary badge-sm">
                                  {
                                    selectedApplication.applicant.experience
                                      .length
                                  }{" "}
                                  {selectedApplication.applicant.experience
                                    .length === 1
                                    ? "position"
                                    : "positions"}
                                </span>
                              </div>

                              <div className="space-y-3 mt-2">
                                {selectedApplication.applicant.experience.map(
                                  (exp) => (
                                    <div
                                      key={exp._id}
                                      className="rounded-xl bg-base-100 border border-base-300 p-4"
                                    >
                                      <p className="font-bold wrap-break-word">
                                        {exp.position ||
                                          "Position not provided"}
                                      </p>

                                      <p className="text-sm opacity-70 mt-1 wrap-break-word">
                                        {exp.company || "Company not provided"}
                                      </p>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mb-6 mt-6">
                        <h3 className="font-semibold text-lg mb-3">Skills</h3>

                        {selectedApplication.applicant.skills?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedApplication.applicant.skills.map(
                              (skill) => (
                                <span
                                  key={skill}
                                  className="badge badge-primary"
                                >
                                  {skill}
                                </span>
                              ),
                            )}
                          </div>
                        ) : (
                          <div className="mt-3 rounded-lg bg-base-200 px-4 py-3 text-sm opacity-60">
                            No skills provided yet.
                          </div>
                        )}
                      </div>

                      <div className="mt-6">
                        <h3 className="font-semibold text-lg mb-3">Resume</h3>

                        {selectedApplication.applicant.resume ? (
                          <a
                            href={selectedApplication.applicant.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline btn-sm sm:btn-md"
                          >
                            View Resume
                          </a>
                        ) : (
                          <div className="rounded-lg bg-base-200 px-4 py-3 text-sm opacity-60">
                            No resume uploaded.
                          </div>
                        )}
                      </div>

                      <div className="modal-action flex-col-reverse sm:flex-row sm:justify-between gap-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          {selectedApplication.status === "Applied" && (
                            <>
                              <button
                                className="btn btn-success w-full sm:w-auto"
                                onClick={handleShortlist}
                              >
                                Shortlist
                              </button>

                              <button
                                className="btn btn-error w-full sm:w-auto"
                                onClick={handleReject}
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {selectedApplication.status === "Shortlisted" && (
                            <div className="alert alert-success py-2">
                              <span className="font-semibold">
                                Applicant is already shortlisted.
                              </span>
                            </div>
                          )}

                          {selectedApplication.status === "Rejected" && (
                            <div className="alert alert-error py-2">
                              <span className="font-semibold">
                                Applicant has already been rejected.
                              </span>
                            </div>
                          )}

                          {selectedApplication.status === "Withdrawn" && (
                            <div className="alert alert-warning py-2">
                              <span className="font-semibold">
                                Applicant withdrew this application.
                              </span>
                            </div>
                          )}
                        </div>

                        <form method="dialog">
                          <button className="btn w-full sm:w-auto">
                            Close
                          </button>
                        </form>
                      </div>
                    </>
                  )}
                </div>
              </dialog>
            </div>

            <dialog id="ai_modal" className="modal">
              <div className="modal-box w-11/12 max-w-3xl h-[80vh] sm:h-[75vh] flex flex-col">
                <h3 className="font-bold text-xl sm:text-2xl mb-4">
                  ✨ AI Hiring Assistant
                </h3>

                <div className="flex-1 overflow-y-auto space-y-4">
                  {messages.length === 0 && (
                    <div className="space-y-3">
                      <p className="opacity-70">
                        Ask me anything about your applicants.
                      </p>

                      <div className="bg-base-200 rounded-xl p-4 space-y-2">
                        <p>Suggest the top 3 candidates.</p>
                        <p>Summarize all applicants.</p>
                        <p>Who should I interview first?</p>
                        <p>
                          Which applicant has the strongest frontend profile?
                        </p>
                      </div>
                    </div>
                  )}

                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`chat ${
                        msg.role === "user" ? "chat-end" : "chat-start"
                      }`}
                    >
                      <div className="chat-bubble prose prose-sm max-w-[85%] sm:max-w-none">
                        {msg.role === "assistant" ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <span className="loading loading-dots loading-md"></span>
                  )}
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-2">
                  <input
                    className="input input-bordered flex-1 w-full"
                    placeholder="Ask about your applicants..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                  />

                  <button
                    className="btn btn-primary w-full sm:w-auto"
                    onClick={handleAskAI}
                  >
                    Send
                  </button>
                </div>
              </div>

              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>

            <AnimatePresence>
              {success && (
                <div className="toast toast-top toast-center z-50 w-full px-4">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="alert alert-success w-full sm:w-auto"
                  >
                    <span>{success}</span>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <div className="toast toast-top toast-center z-50 w-full px-4">
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="alert alert-error shadow-lg w-full sm:w-auto"
                  >
                    <span>{error}</span>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.li>
        ))
      )}
    </ul>
  );
};

export default AllApplications;
