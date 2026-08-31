import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  applyJob,
  bookMarkJob,
  fetchJobDetails,
  withdrawJob,
} from "../../utils/applicant/applicantSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  IndianRupee,
  Briefcase,
  MapPinIcon,
  Bookmark,
  BookmarkOff,
} from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import NotFound from "../NotFound";

const JobDetails = () => {
  const { id } = useParams();
  const {
    selectedJob,
    status,
    recruiterProfile,
    similarJobs,
    applicantsCount,
    hasApplied,
    hasBookmarked,
    hasResume,
  } = useSelector((state) => state.applicant);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("details");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchJobDetails(id));
  }, [dispatch, id]);

  const handleApplyJob = async () => {
    try {
      const res = await dispatch(applyJob(id)).unwrap();

      setSuccess(res.message || "Applied successfully!");
      setError("");

      await dispatch(fetchJobDetails(id));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err);
      setSuccess("");

      setTimeout(() => setError(""), 3000);
    }
  };

  const handleWithdraw = async () => {
    try {
      const res = await dispatch(withdrawJob(id)).unwrap();
      setSuccess(res.message || "Application withdrawn successfully!");
      setError("");

      await dispatch(fetchJobDetails(id));

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err);
      setSuccess("");

      setTimeout(() => setError(""), 3000);
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await dispatch(bookMarkJob(id)).unwrap();
      setSuccess(res.message || "Bookmark successful!");
      setError("");

      await dispatch(fetchJobDetails(id));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err);
      setSuccess("");

      setTimeout(() => setError(""), 3000);
    }
  };

  if (status === "failed") {
    return <NotFound />;
  }

  const postedAgo = (createdAt) => {
    const difference = new Date() - new Date(createdAt);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";

    return `${days} days ago`;
  };

  return (
    <>
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/applicant" className="btn btn-ghost btn-sm gap-2 mb-6">
          <ArrowLeft size={18} />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              className="card bg-base-100 border border-base-300 shadow-sm"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">
                  <div className="flex items-start gap-3 sm:gap-5">
                    <div className="avatar">
                      <div className="flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-xl border shrink-0">
                        <span className="text-3xl font-bold">
                          {selectedJob?.company?.charAt(0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl sm:text-4xl font-bold wrap-break-word">
                        {selectedJob?.title}
                      </h1>

                      <p className="text-base-content/70 mt-1">
                        {selectedJob?.company}
                      </p>

                      <div className="flex flex-wrap gap-2 sm:gap-6 mt-4 sm:mt-5">
                        <div className="badge badge-outline badge-md">
                          <IndianRupee size={12} />
                          {selectedJob?.salary?.min} - <IndianRupee size={12} />
                          {selectedJob?.salary?.max} LPA
                        </div>

                        <div className="badge badge-outline badge-md">
                          <Briefcase size={12} /> {selectedJob?.requiredExp}{" "}
                          Years
                        </div>

                        <div className="badge badge-outline badge-md">
                          <MapPinIcon size={12} /> {selectedJob?.location}
                        </div>

                        {selectedJob?.isRemote && (
                          <div className="badge badge-primary">Remote</div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-5">
                        <div className="badge badge-primary">
                          {selectedJob?.jobType}
                        </div>

                        <div className="badge badge-ghost">
                          {postedAgo(selectedJob?.createdAt)}
                        </div>

                        <div className="badge badge-ghost">
                          Applicants: {applicantsCount}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <div role="tablist" className="tabs tabs-border w-full">
                    <button
                      className={`tab flex-1 sm:flex-none ${activeTab === "details" && "tab-active"}`}
                      onClick={() => setActiveTab("details")}
                    >
                      Job Details
                    </button>

                    <button
                      className={`tab flex-1 sm:flex-none ${activeTab === "company" && "tab-active"}`}
                      onClick={() => setActiveTab("company")}
                    >
                      About Company
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === "details" && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="mt-8">
                          <h2 className="text-xl font-semibold mb-4">
                            Job Description
                          </h2>

                          <p>{selectedJob?.description}</p>
                        </div>

                        <div className="mt-6 sm:mt-8">
                          <h2 className="text-xl font-semibold mb-4">
                            Responsibilities
                          </h2>

                          <ul className="list-disc ml-5 space-y-2">
                            {selectedJob?.responsibilities?.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-8">
                          <h2 className="text-xl font-semibold mb-4">Skills</h2>

                          <div className="flex flex-wrap gap-3">
                            {selectedJob?.skills?.map((skill) => (
                              <div key={skill} className="badge badge-outline">
                                {skill}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "company" && (
                      <div className="mt-8 space-y-6">
                        <div>
                          <h2 className="text-xl font-semibold">Company</h2>

                          <p className="mt-2">{selectedJob?.company}</p>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold">Website</h2>

                          {recruiterProfile?.website ? (
                            <a
                              href={
                                recruiterProfile.website.startsWith(
                                  "http://",
                                ) ||
                                recruiterProfile.website.startsWith("https://")
                                  ? recruiterProfile.website
                                  : `https://${recruiterProfile.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link link-primary mt-3 inline-block"
                            >
                              Visit Company Website
                            </a>
                          ) : (
                            <p className="text-sm text-base-content/60 mt-3">
                              No company website provided.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body">
                <h2 className="card-title">Apply for this Job</h2>

                <div className="space-y-3">
                  {hasApplied ? (
                    <>
                      <div className="alert alert-success">
                        <div>
                          <p className="font-semibold">Application submitted</p>
                          <p className="text-sm">
                            Your application has been sent to the recruiter.
                          </p>
                        </div>
                      </div>

                      <button disabled className="btn btn-disabled w-full">
                        Already Applied
                      </button>
                    </>
                  ) : hasResume ? (
                    <>
                      <div className="alert alert-success">
                        <div>
                          <p className="font-semibold">Resume attached</p>
                          <p className="text-sm">
                            Your profile resume will be used for this
                            application.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleApplyJob}
                        className="btn btn-primary w-full"
                      >
                        Apply Now
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="alert alert-warning">
                        <div>
                          <p className="font-semibold">Resume required</p>
                          <p className="text-sm">
                            Please upload a resume to your profile before
                            applying.
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/applicant/profile"
                        className="btn btn-primary w-full"
                      >
                        Upload Resume
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() =>
                      document.getElementById("withdraw_modal").showModal()
                    }
                    disabled={!hasApplied}
                    className="btn btn-error w-full"
                  >
                    Withdraw Application
                  </button>
                </div>

                <button onClick={handleBookmark} className="btn btn-outline">
                  {hasBookmarked ? <BookmarkOff /> : <Bookmark />}
                  {hasBookmarked ? "Remove Bookmark" : "Save Job"}
                </button>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body">
                <h2 className="card-title">Recruiter</h2>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="avatar placeholder">
                    <div className="flex items-center justify-center bg-neutral text-neutral-content rounded-full w-14 text-lg">
                      <span>
                        {selectedJob?.recruiter?.fullname
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {selectedJob?.recruiter?.fullname}
                    </h3>

                    <p className="text-sm text-base-content/70">
                      {recruiterProfile?.designation}
                    </p>
                  </div>
                </div>

                <button
                  className="btn btn-link p-0 w-fit"
                  onClick={() =>
                    document.getElementById("recruiter_modal").showModal()
                  }
                >
                  View Profile
                </button>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body">
                <h2 className="card-title">
                  {similarJobs.length > 0
                    ? "Similar Jobs"
                    : "No Similar Job(s) found!"}
                </h2>

                <ul className="list bg-base-100 rounded-box">
                  {similarJobs.slice(0, 2).map((job, index) => (
                    <motion.li
                      key={job._id}
                      className="list-row flex items-start gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: { index } * 0.1,
                      }}
                    >
                      <div className="avatar placeholder">
                        <div className="flex items-center justify-center w-10 rounded-lg bg-base-200 border">
                          <span className="font-bold">
                            {job.company?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="font-semibold">{job.title}</div>

                        <div className="text-sm opacity-70">{job.company}</div>

                        <div className="text-xs opacity-60">{job.location}</div>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                {similarJobs.length > 0 && (
                  <button
                    className="btn btn-link p-0 w-fit"
                    onClick={() =>
                      document.getElementById("similar_jobs_modal").showModal()
                    }
                  >
                    View all similar jobs
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <dialog id="recruiter_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-2xl mb-6">Recruiter Profile</h3>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
            <div className="avatar placeholder">
              <div className="flex items-center justify-center bg-neutral text-neutral-content rounded-full w-20 text-3xl">
                <span>
                  {selectedJob?.recruiter?.fullname?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">
                {selectedJob?.recruiter?.fullname}
              </h2>

              <p>{recruiterProfile?.designation}</p>

              <p className="text-base-content/70">
                {recruiterProfile?.company}
              </p>
            </div>
          </div>

          <div className="divider"></div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Works at</h4>
              <p>{recruiterProfile?.companyName}</p>
            </div>

            <div>
              <h4 className="font-semibold">Email</h4>
              <p>{selectedJob?.recruiter?.email}</p>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="similar_jobs_modal" className="modal">
        <div className="modal-box w-11/12 max-w-3xl">
          <h3 className="font-bold text-2xl mb-6">Similar Jobs</h3>

          <ul className="list bg-base-100 rounded-box">
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
              {similarJobs?.length} Similar Jobs Found
            </li>

            {similarJobs?.map((job) => (
  <li
    key={job._id}
    className="list-row flex flex-wrap items-start gap-3"
  >
    <div className="avatar placeholder shrink-0">
      <div className="flex items-center justify-center w-12 rounded-xl bg-base-200 border">
        <span className="font-bold text-lg">
          {job.company?.charAt(0).toUpperCase()}
        </span>
      </div>
    </div>

    <div className="flex-1 min-w-0">
      <div className="font-semibold">{job.title}</div>

      <div className="text-xs uppercase font-semibold opacity-60">
        {job.company}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <div className="badge badge-soft badge-primary badge-sm">
          {job.location}
        </div>

        <div className="badge badge-soft badge-primary badge-sm">
          {job.requiredExp} Years
        </div>

        <div className="badge badge-soft badge-primary badge-sm">
          ₹{job.salary.min} - ₹{job.salary.max} LPA
        </div>
      </div>
    </div>

    <Link
      to={`/applicant/job/${job._id}`}
      className="btn btn-primary btn-sm w-full sm:w-auto sm:ml-auto"
      onClick={() =>
        document.getElementById("similar_jobs_modal").close()
      }
    >
      View
    </Link>
  </li>
))}
          </ul>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="withdraw_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-xl">Withdraw Application?</h3>

          <p className="py-4 text-base-content/70">
            Are you sure you want to withdraw your application for this job? You
            can always apply again later if the position is still open.
          </p>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Cancel</button>
            </form>

            <button
              className="btn btn-error"
              onClick={async () => {
                await handleWithdraw();
                document.getElementById("withdraw_modal").close();
              }}
            >
              Yes, Withdraw
            </button>
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

export default JobDetails;
