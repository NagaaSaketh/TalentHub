import { useEffect, useState } from "react";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Users,
  MoreVertical,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobsByRecruiter,
  updateJob,
  archiveJob,
} from "../../utils/recruiter/recruiterSlice";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RecruiterJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { jobs, status } = useSelector((state) => state.recruiter);

  const [selectedJob, setSelectedJob] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleView = (job) => {
    setSelectedJob({
      ...job,
      salary: {
        min: job.salary.min,
        max: job.salary.max,
      },
    });

    document.getElementById("job_modal").showModal();
  };

  const handleArchive = async () => {
    try {
      await dispatch(
        archiveJob({
          id: selectedJob._id,
          isArchived: selectedJob.isArchived,
        }),
      ).unwrap();

      setSuccess("Job archived successfully!");
      setError("");

      document.getElementById("job_modal").close();

      dispatch(fetchJobsByRecruiter());
    } catch (err) {
      setError(err);
      setSuccess("");
    }
  };

  useEffect(() => {
    dispatch(fetchJobsByRecruiter());
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
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Jobs</h1>
          <p className="text-base-content/60 mt-1">
            Manage all the jobs you've posted.
          </p>
        </div>
      </div>

      <ul className="list bg-base-100 rounded-box shadow-xl border border-base-300">
        <li className="p-6 flex items-center justify-between">
          <div className="badge badge-primary badge-lg">
            Total Jobs posted: {jobs.length}
          </div>
        </li>

        {status === "loading" && (
          <li className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </li>
        )}

        {jobs.map((job, index) => (
          <motion.li
            key={job._id}
            className="list-row items-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="text-3xl font-light opacity-30 w-12">
              {(index + 1).toString().padStart(2, "0")}
            </div>

            <div className="avatar placeholder">
              <div className="flex items-center justify-center bg-primary text-primary-content rounded-full w-12">
                <span>{job.company.charAt(0)}</span>
              </div>
            </div>

            <div className="list-col-grow">
              <div className="font-bold text-lg">{job.title}</div>

              <div className="text-sm opacity-60">{job.company}</div>
            </div>

            <div>
              <div
                className={`badge badge-lg ${
                  job.isArchived ? "badge-warning" : "badge-success"
                }`}
              >
                {job.isArchived ? "Archived" : "Active"}
              </div>
            </div>
            <button
              className="btn btn-outline btn-primary btn-sm"
              onClick={() => handleView(job)}
            >
              View
            </button>
          </motion.li>
        ))}
      </ul>

      <dialog id="job_modal" className="modal">
        <div className="modal-box max-w-4xl">
          {selectedJob && (
            <>
              <h2 className="text-3xl font-bold">{selectedJob.title}</h2>

              <p className="mt-2">{selectedJob.company}</p>

              <div className="divider" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-sm opacity-60">Job Type</p>
                  <p className="font-semibold">{selectedJob.jobType}</p>
                </div>

                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-sm opacity-60">Salary</p>
                  <p className="font-semibold text-md">
                    ₹{selectedJob.salary.min} - ₹{selectedJob.salary.max} LPA
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

              <div className="modal-action justify-between">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>

                <div className="flex gap-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      document.getElementById("job_modal").close();
                      navigate(`/recruiter/jobs/${selectedJob._id}/edit`);
                    }}
                  >
                    Edit Job
                  </button>
                  {!selectedJob.isArchived && (
                    <button className="btn btn-warning" onClick={handleArchive}>
                      Archive Job
                    </button>
                  )}
                </div>
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

export default RecruiterJobs;
