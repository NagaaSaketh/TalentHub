import { useEffect, useState } from "react";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Users,
  MoreVertical,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobsByRecruiter } from "../utils/recruiter/recruiterSlice";
import { Link } from "react-router-dom";

const RecruiterJobs = () => {
  const dispatch = useDispatch();

  const { jobs, status } = useSelector((state) => state.recruiter);

  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    dispatch(fetchJobsByRecruiter());
  }, [dispatch]);

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

      <div className="grid gap-6">
        {status === "loading" && (
          <span className="loading loading-spinner loading-lg mx-auto" />
        )}

        {jobs.map((job) => (
          <div key={job._id} className="card bg-base-100 shadow-lg border">
            <div className="card-body">
              <div className="flex justify-between">
                <div>
                  <h2 className="card-title text-2xl">{job.title}</h2>

                  <p className="text-base-content/60">{job.company}</p>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`badge ${
                      job.isArchived ? "badge-warning" : "badge-success"
                    }`}
                  >
                    {job.isArchived ? "Archived" : "Active"}
                  </div>

                  <div className="dropdown dropdown-end">
                    <button tabIndex={0} className="btn btn-ghost btn-sm">
                      <MoreVertical />
                    </button>

                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box shadow w-52"
                    >
                      <li>
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            document.getElementById("job_modal").showModal();
                          }}
                        >
                          View Details
                        </button>
                      </li>

                      <li>
                        <button>Edit Job</button>
                      </li>

                      <li>
                        <button>Applicants</button>
                      </li>

                      <li>
                        <button className="text-warning">Archive</button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div className="grid md:grid-cols-4 gap-5">
                <div className="flex items-center gap-2">
                  <Briefcase size={18} />
                  {job.jobType}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  {job.location}
                </div>

                <div className="flex items-center gap-2">
                  <IndianRupee size={18} />
                  {job.salary.min.toLocaleString()} -{" "}
                  {job.salary.max.toLocaleString()}
                </div>

                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <td>{job.applicantCount}</td>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <dialog id="job_modal" className="modal">
        <div className="modal-box max-w-4xl">
          {selectedJob && (
            <>
              <h2 className="text-3xl font-bold">{selectedJob.title}</h2>

              <p className="mt-2">{selectedJob.company}</p>

              <div className="divider" />

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="label">Title</label>

                  <input
                    className="input input-bordered w-full"
                    defaultValue={selectedJob.title}
                  />
                </div>

                <div>
                  <label className="label">Company</label>

                  <input
                    className="input input-bordered w-full"
                    defaultValue={selectedJob.company}
                  />
                </div>

                <div>
                  <label className="label">Salary</label>

                  <input
                    className="input input-border"
                    defaultValue={selectedJob.salary.min}
                  />

                  <input
                    className="input input-border"
                    defaultValue={selectedJob.salary.max}
                  />
                </div>

                <div>
                  <label className="label">Location</label>

                  <input
                    className="input input-bordered w-full"
                    defaultValue={selectedJob.location}
                  />
                </div>
              </div>

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>

                <button className="btn btn-primary">Save</button>

                <button className="btn btn-warning">Archive</button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  );
};

export default RecruiterJobs;
