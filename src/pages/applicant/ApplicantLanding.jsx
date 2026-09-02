import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const fadeLeftVariants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const ApplicantLanding = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [featuredRes, recentRes] = await Promise.all([
          api.get("/jobs/featured"),
          api.get("/jobs?sort=latest"),
        ]);

        setFeaturedJobs(featuredRes.data.slice(0, 3));
        setRecentJobs(recentRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      return;
    }

    window.location.href = `/applicant/jobs?search=${encodeURIComponent(
      search.trim(),
    )}`;
  };

  const formatSalary = (salary) => {
    if (!salary) return "Salary not specified";

    return `₹ ${salary.min} - ${salary.max} LPA`;
  };

  const getInitial = (company) => {
    return company?.charAt(0)?.toUpperCase() || "J";
  };

  const JobCard = ({ job }) => (
    <motion.div
      variants={fadeUpVariants}
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
      }}
      className="h-full"
    >
      <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg transition-shadow h-full">
        <div className="card-body p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl border border-base-300 flex items-center justify-center text-lg sm:text-xl font-bold">
              {getInitial(job.company)}
            </div>

            <div className="min-w-0 w-full">
              <h3 className="text-base sm:text-lg font-bold wrap-break-word">
                {job.title}
              </h3>

              <p className="text-sm text-base-content/60 wrap-break-word mt-1">
                {job.company}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="badge badge-ghost text-xs sm:text-sm">
                  {formatSalary(job.salary)}
                </span>

                <span className="badge badge-ghost text-xs sm:text-sm">
                  {job.requiredExp} Years
                </span>

                <span className="badge badge-ghost text-xs sm:text-sm max-w-full">
                  {job.location}
                </span>
              </div>
            </div>
          </div>

          <div className="card-actions justify-stretch sm:justify-end mt-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link
                to={`/applicant/job/${job._id}`}
                className="btn btn-primary btn-sm w-full sm:w-auto"
              >
                View Job
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-base-200">
      <section className="bg-base-100 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUpVariants}
              className="badge badge-primary badge-sm mb-4"
            >
              Find your next opportunity
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight"
            >
              Find the Right Job for You
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-base-content/60"
            >
              Discover opportunities from growing companies and take the next
              step in your career.
            </motion.p>

            <motion.form
              onSubmit={handleSearch}
              variants={fadeUpVariants}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 w-full"
            >
              <div className="input input-bordered flex items-center gap-3 w-full min-w-0 bg-base-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5 shrink-0 opacity-50"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>

                <input
                  type="text"
                  className="w-full min-w-0 outline-none bg-transparent"
                  placeholder="Search jobs, companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary w-full sm:w-auto sm:px-8"
              >
                Search Jobs
              </motion.button>
            </motion.form>

            <motion.div variants={fadeUpVariants} className="mt-4">
              <Link
                to="/applicant/jobs"
                className="btn btn-primary btn-outline btn-sm text-sm font-medium"
              >
                Browse all jobs
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <section>
          <motion.div
            variants={fadeLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex items-end justify-between gap-4 mb-6"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Featured Jobs</h2>

              <p className="text-sm text-base-content/60 mt-1">
                Explore some of the best opportunities available right now.
              </p>
            </div>
            {featuredJobs.length > 0 && (
              <Link
                to="/applicant/jobs?sort=featured"
                className="hidden sm:inline-flex btn btn-ghost btn-sm"
              >
                View all
              </Link>
            )}
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : featuredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="alert"
            >
              <span>No featured jobs available right now.</span>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </motion.div>
          )}
        </section>

        <section className="mt-10 sm:mt-14">
          <motion.div
            variants={fadeLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex items-end justify-between gap-4 mb-6"
          >
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                Recently Posted Jobs
              </h2>

              <p className="text-xs sm:text-sm text-base-content/60 mt-1">
                Check out the latest opportunities posted by recruiters.
              </p>
            </div>

            <Link
              to="/applicant/jobs"
              className="hidden sm:inline-flex btn btn-ghost btn-sm"
            >
              View all
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : recentJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="alert"
            >
              <span>No recent jobs available right now.</span>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {recentJobs.map((job) => (
                <motion.div
                  key={job._id}
                  variants={fadeUpVariants}
                  whileHover={{
                    y: -4,
                    scale: 1.005,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 22,
                  }}
                  className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg"
                >
                  <div className="card-body p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-12 h-12 shrink-0 rounded-xl border border-base-300 flex items-center justify-center font-bold text-lg">
                        {getInitial(job.company)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg wrap-break-word">
                          {job.title}
                        </h3>

                        <p className="text-sm text-base-content/60 wrap-break-word">
                          {job.company}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="badge badge-sm badge-ghost text-xs sm:text-sm">
                            {formatSalary(job.salary)}
                          </span>

                          <span className="badge badge-sm badge-ghost text-xs sm:text-sm">
                            {job.requiredExp} Years
                          </span>

                          <span className="badge badge-sm badge-ghost text-xs sm:text-sm max-w-full">
                            {job.location}
                          </span>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto"
                      >
                        <Link
                          to={`/applicant/job/${job._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View Job
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
        <motion.section
          className="mt-10 sm:mt-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          <div className="hero bg-primary text-primary-content rounded-2xl">
            <div className="hero-content text-center py-10 sm:py-12 px-6">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Ready to find your next job?
                </h2>

                <p className="mt-3 text-sm sm:text-base opacity-90">
                  Browse all available opportunities and find the role that
                  matches your skills and experience.
                </p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/applicant/jobs"
                    className="btn btn-sm bg-base-100 text-primary border-none hover:bg-base-200 mt-6"
                  >
                    Browse All Jobs
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default ApplicantLanding;
