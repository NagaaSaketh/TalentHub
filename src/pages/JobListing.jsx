import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  Menu,
  IndianRupee,
  MapPin,
  Briefcase,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

import FilterBar from "../components/FilterBar";
import { fetchAllJobs } from "../utils/jobs/jobSlice";

const JobListing = () => {
  const dispatch = useDispatch();

  const { jobs } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchAllJobs());
  }, [dispatch]);

  return (
    <div className="drawer">
      <input id="filter-drawer" type="checkbox" className="drawer-toggle" />

      <FilterBar />

      <div className="drawer-content">
        <div className="flex">
          <main className="flex-1 p-6">
            <div className="lg:hidden mb-6">
              <label
                htmlFor="filter-drawer"
                className="btn btn-outline btn-primary"
              >
                <Menu size={18} />
                Filters
              </label>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
              <div>
                <h1 className="text-4xl font-bold">All Jobs</h1>

                <p className="text-base-content/60">{jobs.length} jobs found</p>
              </div>

              <select className="select select-bordered w-full md:w-60">
                <option>Most Recent</option>
                <option>Salary: Low to High</option>
                <option>Salary: High to Low</option>
              </select>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="card-body p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="flex gap-4">
                        <div className="avatar">
                          <div className="w-14 h-14 rounded-xl border border-base-300 bg-base-100 flex items-center justify-center">
                            <span className="text-xl font-bold text-black">
                              {job.company?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h2 className="text-xl font-semibold">{job.title}</h2>

                          <p className="text-base-content/70">{job.company}</p>

                          <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-base-content/70">
                            <div className="flex items-center gap-1">
                              <IndianRupee size={16} />
                              <span>
                                {job.salary.min} - {job.salary.max} LPA
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <Briefcase size={16} />
                              <span>{job.requiredExp} Years</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              <span>{job.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-end justify-between gap-4">
                        <button className="btn btn-ghost btn-circle">
                          <Bookmark size={20} />
                        </button>

                        <button className="btn btn-primary px-8">
                          View Job
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default JobListing;
