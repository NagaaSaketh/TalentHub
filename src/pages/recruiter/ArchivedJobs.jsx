import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchArchivedJobs,
  archiveJob,
} from "../../utils/recruiter/recruiterSlice";
import { motion, AnimatePresence } from "framer-motion";

const ArchivedJobs = () => {
  const { archivedJobs, status } = useSelector((state) => state.recruiter);
  const dispatch = useDispatch();
  const [selectedJob, setSelectedJob] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  console.log(archivedJobs);

  const handleRestore = async () => {
    try {
      await dispatch(
        archiveJob({
          id: selectedJob._id,
          isArchived: selectedJob.isArchived,
        }),
      ).unwrap();

      setSuccess("Job restored successfully!");
      setError("");

      document.getElementById("archived_job_modal").close();

      dispatch(fetchArchivedJobs());
    } catch (err) {
      setError(err.message || "Failed to restore job.");
      setSuccess("");
    }
  };

  const handleView = (job) => {
    setSelectedJob(job);
    document.getElementById("archived_job_modal").showModal();
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
    dispatch(fetchArchivedJobs());
  }, [dispatch]);
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Archived Jobs</h1>
          <p className="text-base-content/60 mt-1">
            Jobs that are no longer accepting applications.
          </p>
        </div>
      </div>
      {status === "loading" ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : archivedJobs.length === 0 ? (
        <div className="hero bg-base-200 rounded-box py-16">
          <div className="hero-content text-center">
            <div>
              <h2 className="text-3xl font-bold">No Archived Jobs</h2>
              <p className="py-3 text-base-content/70">
                You haven't archived any jobs yet.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <ul className="list bg-base-100 rounded-box shadow-xl border border-base-300">
          <li className="p-6 flex items-center justify-between">
            <div className="badge badge-primary badge-lg">
              Archived Jobs: {archivedJobs.length}
            </div>
          </li>

          {status === "loading" && (
            <li className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg"></span>
            </li>
          )}

          {archivedJobs.map((job, index) => (
            <motion.li
              key={job._id}
              className="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="hidden sm:block text-2xl font-light opacity-30 w-10 shrink-0">
                {(index + 1).toString().padStart(2, "0")}
              </div>

              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="avatar placeholder shrink-0">
                  <div className="flex items-center justify-center bg-primary text-primary-content rounded-full w-12">
                    <span>{job.company?.charAt(0)}</span>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="font-bold text-lg truncate">{job.title}</div>

                  <div className="text-sm opacity-60 truncate">
                    {job.company}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 w-full md:w-auto">
                <div className="badge badge-warning badge-md sm:badge-lg">
                  Archived
                </div>

                <button
                  className="btn btn-outline btn-primary btn-sm"
                  onClick={() => handleView(job)}
                >
                  View
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
      <dialog id="archived_job_modal" className="modal">
        <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <h2 className="text-3xl font-bold">{selectedJob.title}</h2>

              <p className="mt-2">{selectedJob.company}</p>

              <div className="divider" />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-sm opacity-60">Job Type</p>
                  <p className="font-semibold">{selectedJob.jobType}</p>
                </div>

                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-sm opacity-60">Salary</p>
                  <p className="font-semibold text-md">
                    {selectedJob.salary.min} - {selectedJob.salary.max} LPA
                  </p>
                </div>

                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-sm opacity-60">Experience</p>
                  <p className="font-semibold">
                    {selectedJob.requiredExp} Years
                  </p>
                </div>

                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-sm opacity-60">Location</p>
                  <p className="font-semibold">{selectedJob.location}</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Job Description</h3>

                <p className="leading-7 text-base-content/80">
                  {selectedJob.description}
                </p>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>

                <ul className="list-disc ml-6 space-y-2">
                  {selectedJob.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Skills</h3>

                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill) => (
                    <span key={skill} className="badge badge-primary badge-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm opacity-60">Remote</p>
                <p className="font-semibold">
                  {selectedJob.isRemote ? "Yes" : "No"}
                </p>
              </div>

              <div className="modal-action flex-col-reverse sm:flex-row sm:justify-between gap-3">
                <form method="dialog" className="w-full sm:w-auto">
                  <button className="btn w-full sm:w-auto">Close</button>
                </form>

                <button
                  className="btn btn-success w-full sm:w-auto"
                  onClick={handleRestore}
                >
                  Restore Job
                </button>
              </div>
            </>
          )}
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

export default ArchivedJobs;
