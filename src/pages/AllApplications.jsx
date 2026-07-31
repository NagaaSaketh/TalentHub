import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  fetchRecruiterApplications,
  shortlistApplicant,
  rejectApplicant,
} from "../utils/recruiter/recruiterSlice";
import { MoreVertical,Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../api/axios";

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
    <ul className="list bg-base-100 rounded-box shadow-md">
      <li className="p-5 flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Applications</h2>

        <div className="flex items-center gap-3">
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
                        <div className="w-16 flex items-center justify-center rounded-full shadow-lg bg-primary text-primary-content">
                          <span className="text-2xl font-bold">
                            {selectedApplication.applicant.user.fullname
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold">
                          {selectedApplication.applicant.user.fullname}
                        </h2>

                        <p className="text-base-content/60">
                          {selectedApplication.applicant.user.email}
                        </p>

                        <div className="mt-2 flex gap-2">
                          <div className="badge badge-outline">
                            Years of Experience:{" "}
                            {selectedApplication.applicant.totalExperience}{" "}
                          </div>

                          <div className="badge badge-outline">
                            Current Location:{" "}
                            {selectedApplication.applicant.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="card bg-base-200 border border-base-300">
                        <div className="card-body">
                          <h3 className="card-title">Job Applied</h3>

                          <p className="text-md font-bold">
                            {selectedApplication.job.title}
                          </p>

                          <p className="opacity-70">
                            {selectedApplication.job.company}
                          </p>

                          <div className="divider my-2"></div>

                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm opacity-60">Applied On</p>

                              <p className="font-semibold">
                                {new Date(
                                  selectedApplication.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card bg-base-200 border border-base-300">
                        <div className="card-body">
                          <h3 className="card-title">Experience</h3>

                          <div className="space-y-3">
                            {selectedApplication.applicant.experience.map(
                              (exp) => (
                                <div
                                  key={exp._id}
                                  className="rounded-xl bg-base-100 border border-base-300 p-4"
                                >
                                  <p className="font-bold">{exp.position}</p>

                                  <p className="opacity-70">{exp.company}</p>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold text-lg mb-3">Skills</h3>

                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.applicant.skills.map((skill) => (
                          <span
                            key={skill}
                            className="badge badge-primary badge-md"
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
          <dialog id="ai_modal" className="modal">
            <div className="modal-box max-w-3xl h-[75vh] flex flex-col">
              <h3 className="font-bold text-2xl mb-4">
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
                      <p>Which applicant has the strongest frontend profile?</p>
                    </div>
                  </div>
                )}

                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                  >
                    <div className="chat-bubble prose prose-sm max-w-none">
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

              <div className="mt-5 flex gap-2">
                <input
                  className="input input-bordered flex-1"
                  placeholder="Ask about your applicants..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                />

                <button className="btn btn-primary" onClick={handleAskAI}>
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
