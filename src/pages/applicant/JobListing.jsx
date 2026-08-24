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
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold">All Jobs</h1>

                <p className="text-base-content/60">{jobs.length} jobs found</p>
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
                <option value="salary-asc">Salary: Low to High</option>
                <option value="salary-desc">Salary: High to Low</option>
              </motion.select>
            </div>

            <motion.div
              className="space-y-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {status === "loading" ? (
                <div className="flex justify-center items-center py-20">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <h2 className="text-3xl font-bold">No Jobs Found</h2>

                  <p className="mt-3 text-base-content/60">
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
                    <div className="card-body p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex gap-5 flex-1">
                          <div className="avatar">
                            <div className="w-14 h-14 rounded-xl border border-base-300 bg-base-100 flex items-center justify-center">
                              <span className="text-xl font-bold text-black">
                                {job.company?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h2 className="text-2xl font-semibold">
                              {job.title}
                            </h2>

                            <p className="text-sm text-base-content/60 mt-1">
                              {job.company}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 mt-5 text-sm text-base-content/70">
                              <div className="flex items-center gap-1">
                                <IndianRupee size={16} />
                                <span>
                                  {job.salary?.min} -{" "}
                                  {job.salary?.max} LPA
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
                          <Link to={`job/${job._id}`}>
                            <motion.button
                              whileHover={{
                                scale: 1.05,
                              }}
                              whileTap={{
                                scale: 0.95,
                              }}
                              className="btn btn-primary px-8"
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
