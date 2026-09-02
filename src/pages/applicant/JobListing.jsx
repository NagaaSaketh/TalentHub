import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, IndianRupee, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

import FilterBar from "../../components/applicant/FilterBar";
import { fetchAllJobs } from "../../utils/applicant/applicantSlice";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const JobListing = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("latest");
  const { jobs, search, status } = useSelector((state) => state.applicant);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    setSearchParams(params);
  };

  console.log(jobs);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchAllJobs({
          filters: searchParams.toString(),
          search,
        }),
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, searchParams, search]);

  return (
    <div className="drawer">
      <input id="filter-drawer" type="checkbox" className="drawer-toggle" />

      <FilterBar
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />

      <div className="drawer-content min-w-0">
        <div className="flex min-w-0">
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            <div className="lg:hidden mb-5">
              <label
                htmlFor="filter-drawer"
                className="btn btn-outline btn-primary w-full sm:w-auto"
              >
                <Menu size={18} />
                Filters
              </label>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-5 mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="min-w-0"
              >
                <h1 className="text-3xl sm:text-4xl font-bold">
                  {searchParams.get("sort") === "featured"
                    ? "Featured Jobs"
                    : "All Jobs"}
                </h1>

                <p className="text-sm sm:text-base text-base-content/60">
                  {jobs.length} jobs found
                </p>
              </motion.div>

              <motion.select
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="select select-bordered w-full md:w-60"
                value={searchParams.get("sort") || "latest"}
                onChange={(e) => updateParam("sort", e.target.value)}
              >
                <option value="latest">Most Recent</option>
                <option value="featured">Featured Jobs</option>
                <option value="salary-asc">Salary: Low to High</option>
                <option value="salary-desc">Salary: High to Low</option>
              </motion.select>
            </div>

            <motion.div
              className="space-y-4 sm:space-y-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {status === "loading" ? (
                <div className="flex justify-center items-center py-20">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-center px-4">
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    No Jobs Found
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-base-content/60">
                    Try changing your filters or search keyword.
                  </p>
                </div>
              ) : (
                jobs.map((job) => (
                  <motion.div
                    key={job._id}
                    variants={cardVariants}
                    whileHover={{
                      y: -5,
                      scale: 1.01,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 22,
                    }}
                    className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-lg"
                  >
                    <div className="card-body p-4 sm:p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-6">
                        <div className="flex gap-3 sm:gap-5 flex-1 min-w-0">
                          <div className="avatar shrink-0">
                            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl border border-base-300 bg-base-100 flex items-center justify-center">
                              <span className="text-lg sm:text-xl font-bold text-black">
                                {job.company?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h2 className="text-xl sm:text-2xl font-semibold wrap-break-word">
                              {job.title}
                            </h2>

                            <p className="text-sm text-base-content/60 mt-1 truncate">
                              {job.company}
                            </p>

                            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-x-6 sm:gap-y-2 mt-4 sm:mt-5 text-sm text-base-content/70">
                              <div className="flex items-center gap-1">
                                <IndianRupee size={16} className="shrink-0" />
                                <span>
                                  {job.salary?.min} - {job.salary?.max} LPA
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Briefcase size={16} className="shrink-0" />
                                <span>{job.requiredExp} Years</span>
                              </div>

                              <div className="flex items-center gap-1 min-w-0">
                                <MapPin size={16} className="shrink-0" />
                                <span className="truncate">{job.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full md:w-auto">
                          <Link
                            to={`/applicant/job/${job._id}`}
                            className="block w-full md:w-auto"
                          >
                            <motion.button
                              whileHover={{
                                scale: 1.05,
                              }}
                              whileTap={{
                                scale: 0.95,
                              }}
                              className="btn btn-primary w-full md:w-auto px-8"
                            >
                              View Job
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default JobListing;
