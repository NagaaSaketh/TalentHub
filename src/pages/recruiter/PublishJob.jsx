import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { createJobs } from "../../utils/recruiter/recruiterSlice";
const PublishJob = () => {
  const dispatch = useDispatch();
  const initialJobData = {
    title: "",
    company: "",
    jobType: "",
    salary: {
      min: "",
      max: "",
    },
    skills: [],
    description: "",
    responsibilities: [],
    requiredExp: "",
    deadline: "",
    location: "",
    isRemote: false,
    isFeatured: false,
  };
  const [jobData, setJobData] = useState(initialJobData);
  const [skillInput, setSkillInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const saveDraft = () => {
    localStorage.setItem(
      "jobDraft",
      JSON.stringify({
        ...jobData,
        skillInput,
        responsibilityInput,
      }),
    );

    setSuccess("Draft saved successfully!");
    setError("");

    setTimeout(() => setSuccess(""), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setJobData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;

    setJobData((prev) => ({
      ...prev,
      salary: {
        ...prev.salary,
        [name]: value,
      },
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();

      if (!jobData.skills.includes(skillInput.trim())) {
        setJobData((prev) => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()],
        }));
      }

      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setJobData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleResponsibilityKeyDown = (e) => {
    if (e.key === "Enter" && responsibilityInput.trim()) {
      e.preventDefault();

      setJobData((prev) => ({
        ...prev,
        responsibilities: [
          ...prev.responsibilities,
          responsibilityInput.trim(),
        ],
      }));

      setResponsibilityInput("");
    }
  };

  const removeResponsibility = (index) => {
    setJobData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const validateJob = () => {
    if (!jobData.title.trim()) {
      return "Job title is required";
    }

    if (!/[A-Za-z]/.test(jobData.title)) {
      return "Please enter a valid job title";
    }

    if (!jobData.company.trim()) {
      return "Company name is required";
    }

    if (!/[A-Za-z]/.test(jobData.company)) {
      return "Please enter a valid company name";
    }

    if (!jobData.jobType) {
      return "Please select employment type";
    }

    if (jobData.salary.min === "" || jobData.salary.max === "") {
      return "Salary range is required";
    }

    const minSalary = Number(jobData.salary.min);
    const maxSalary = Number(jobData.salary.max);

    if (minSalary <= 0 || maxSalary <= 0) {
      return "Salary must be greater than 0";
    }

    if (minSalary === maxSalary) {
      setError(
        "Minimum salary and maximum salary cannot be the same. Please enter a higher maximum salary.",
      );
      setSuccess("");
      return;
    }

    if (minSalary > maxSalary) {
      setError("Minimum salary cannot be higher than maximum salary.");
      setSuccess("");
      return;
    }
    
    if (jobData.requiredExp === "") {
      return "Please select required experience";
    }

    if (!jobData.description.trim()) {
      return "Job description is required";
    }

    if (jobData.responsibilities.length === 0) {
      return "Please add at least one responsibility";
    }

    if (jobData.skills.length === 0) {
      return "Please add at least one skill";
    }

    if (!jobData.location) {
      return "Please select a location";
    }

    if (!jobData.deadline) {
      return "Application deadline is required";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(`${jobData.deadline}T00:00:00`);

    if (deadline < today) {
      return "Application deadline cannot be in the past";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateJob();

    if (validationError) {
      setError(validationError);
      setSuccess("");

      setTimeout(() => {
        setError("");
      }, 3000);

      return;
    }

    const payload = {
      ...jobData,
      salary: {
        min: Number(jobData.salary.min),
        max: Number(jobData.salary.max),
      },
      requiredExp: Number(jobData.requiredExp),
      deadline: new Date(jobData.deadline).toISOString(),
    };

    try {
      const res = await dispatch(createJobs(payload)).unwrap();

      setSuccess(res.message || "Job published successfully!");
      setError("");

      setTimeout(() => setSuccess(""), 3000);

      localStorage.removeItem("jobDraft");

      setJobData(initialJobData);
      setSkillInput("");
      setResponsibilityInput("");
    } catch (err) {
      setError(err?.message || "Something went wrong!");
      setSuccess("");

      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    const draft = localStorage.getItem("jobDraft");

    if (draft) {
      const parsed = JSON.parse(draft);

      setJobData({
        title: parsed.title || "",
        company: parsed.company || "",
        jobType: parsed.jobType || "",
        salary: parsed.salary || {
          min: "",
          max: "",
        },
        skills: parsed.skills || [],
        description: parsed.description || "",
        responsibilities: parsed.responsibilities || [],
        requiredExp: parsed.requiredExp || "",
        deadline:
          parsed.deadline && !isNaN(new Date(parsed.deadline).getTime())
            ? parsed.deadline
            : "",
        location: parsed.location || "",
        isRemote: parsed.isRemote || false,
        isFeatured: parsed.isFeatured || false,
      });

      setSkillInput(parsed.skillInput || "");
      setResponsibilityInput(parsed.responsibilityInput || "");
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="max-w-7xl mx-auto px-6 py-10"
    >
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-3xl font-bold"
                >
                  Create New Job
                </motion.h1>

                <p className="text-base-content/60 mt-2">
                  Fill in the information below to publish a new job opening.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card bg-base-100 border border-base-300 shadow-md"
              >
                <div className="card-body">
                  <h2 className="text-2xl font-semibold mb-6">
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-sm font-semibold">
                        Job Title <span className="text-error">*</span>
                      </legend>

                      <input
                        name="title"
                        value={jobData.title}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        placeholder="Frontend Developer"
                      />
                    </fieldset>

                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-sm font-semibold">
                        Company <span className="text-error">*</span>
                      </legend>

                      <input
                        name="company"
                        value={jobData.company}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        placeholder="Acme Inc."
                      />
                    </fieldset>

                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-sm font-semibold">
                        Employment Type <span className="text-error">*</span>
                      </legend>

                      <select
                        name="jobType"
                        value={jobData.jobType}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select Type</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </fieldset>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card bg-base-100 border border-base-300 shadow-md"
              >
                <div className="card-body">
                  <h2 className="text-xl font-semibold mb-5">Compensation</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-sm font-semibold">
                        Salary <span className="text-error">*</span>
                      </legend>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          name="min"
                          type="number"
                          value={jobData.salary.min}
                          onChange={handleSalaryChange}
                          placeholder="Min"
                          className="input input-bordered"
                        />

                        <input
                          name="max"
                          type="number"
                          value={jobData.salary.max}
                          onChange={handleSalaryChange}
                          placeholder="Max"
                          className="input input-bordered"
                        />
                      </div>
                    </fieldset>

                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-sm font-semibold">
                        Experience Required{" "}
                        <span className="text-error">*</span>
                      </legend>

                      <select
                        name="requiredExp"
                        value={jobData.requiredExp}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select experience</option>
                        <option value={0}>Fresher</option>
                        <option value={1}>1 Year</option>
                        <option value={2}>2 Years</option>
                        <option value={3}>3 Years</option>
                        <option value={4}>4 Years</option>
                        <option value={5}>5+ Years</option>
                      </select>
                    </fieldset>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card bg-base-100 border border-base-300 shadow-md"
              >
                <div className="card-body">
                  <h2 className="text-2xl font-semibold mb-6">Job Details</h2>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-sm font-semibold">
                        Job Description <span className="text-error">*</span>
                      </legend>

                      <textarea
                        name="description"
                        value={jobData.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered h-48"
                        placeholder="Describe the role..."
                      />
                    </fieldset>

                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-sm font-semibold">
                        Responsibilites <span className="text-error">*</span>
                      </legend>

                      <input
                        value={responsibilityInput}
                        onChange={(e) => setResponsibilityInput(e.target.value)}
                        onKeyDown={handleResponsibilityKeyDown}
                        className="input input-bordered"
                        placeholder="Press Enter to add"
                      />

                      <div className="mt-4 max-h-56 overflow-y-auto space-y-3">
                        <AnimatePresence>
                          {jobData.responsibilities.map((item, index) => (
                            <motion.div
                              key={index}
                              layout
                              initial={{
                                opacity: 0,
                                x: -20,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                              }}
                              exit={{
                                opacity: 0,
                                x: 20,
                              }}
                              className="flex justify-between items-center rounded-xl bg-base-200 p-3"
                            >
                              <span>{item}</span>

                              <button
                                type="button"
                                className="btn btn-error btn-xs"
                                onClick={() => removeResponsibility(index)}
                              >
                                Remove
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </fieldset>
                  </div>

                  <fieldset className="fieldset mt-8">
                    <legend className="fieldset-legend text-sm font-semibold">
                      Skills <span className="text-error">*</span>
                    </legend>

                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      className="input input-bordered"
                      placeholder="React, Node.js..."
                    />

                    <p className="text-sm opacity-60 mt-2">
                      Press Enter after each skill.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5">
                      <AnimatePresence>
                        {jobData.skills.map((skill) => (
                          <motion.div
                            key={skill}
                            layout
                            initial={{
                              scale: 0,
                            }}
                            animate={{
                              scale: 1,
                            }}
                            exit={{
                              scale: 0,
                            }}
                            className="badge badge-primary badge-lg gap-2 px-4 py-4"
                          >
                            {skill}

                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                            >
                              ✕
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </fieldset>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="card bg-base-100 border border-base-300 shadow-sm"
              >
                <div className="card-body p-5 sm:p-6 lg:p-8">
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                      Additional Information
                    </h2>

                    <p className="text-sm text-base-content/60 mt-1">
                      Add the location, deadline, and work preferences for this
                      job.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="space-y-6">
                      <fieldset className="fieldset">
                        <legend className="fieldset-legend text-sm font-semibold">
                          Location <span className="text-error">*</span>
                        </legend>

                        <select
                          name="location"
                          value={jobData.location}
                          onChange={handleChange}
                          className="select select-bordered w-full"
                        >
                          <option value="">Select Location</option>
                          <option value="Bangalore, Karnataka">
                            Bangalore, Karnataka
                          </option>
                          <option value="Chennai, Tamil Nadu">
                            Chennai, Tamil Nadu
                          </option>
                          <option value="Hyderabad, Telangana">
                            Hyderabad, Telangana
                          </option>
                          <option value="Mumbai, Maharashtra">
                            Mumbai, Maharashtra
                          </option>
                          <option value="Pune, Maharashtra">
                            Pune, Maharashtra
                          </option>
                          <option value="Kochi, Kerala">Kochi, Kerala</option>
                          <option value="Delhi">Delhi</option>
                        </select>
                      </fieldset>

                      <fieldset className="fieldset">
                        <legend className="fieldset-legend text-sm font-semibold">
                          Application Deadline{" "}
                          <span className="text-error">*</span>
                        </legend>

                        <input
                          type="date"
                          name="deadline"
                          value={jobData.deadline}
                          onChange={handleChange}
                          className="input input-bordered w-full"
                        />
                      </fieldset>
                    </div>

                    <div className="space-y-4">
                      <motion.label
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${
                          jobData.isRemote
                            ? "border-primary bg-primary/5"
                            : "border-base-300 bg-base-200/40 hover:border-base-content/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="isRemote"
                          checked={jobData.isRemote}
                          onChange={handleChange}
                          className="checkbox checkbox-primary mt-1"
                        />

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-base">
                                Remote Job
                              </p>

                              <p className="text-sm text-base-content/60 mt-1">
                                Applicants can work remotely.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.label>

                      <motion.label
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${
                          jobData.isFeatured
                            ? "border-primary bg-primary/5"
                            : "border-base-300 bg-base-200/40 hover:border-base-content/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={jobData.isFeatured}
                          onChange={handleChange}
                          className="checkbox checkbox-primary mt-1"
                        />

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-base">
                                Feature this Job
                              </p>

                              <p className="text-sm text-base-content/60 mt-1">
                                Highlight this job on the applicant homepage.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.label>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="divider mt-10"></div>

              <div className="sticky bg-base-100  mt-10 py-5 flex justify-end gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="btn btn-outline"
                  onClick={saveDraft}
                >
                  Save Draft
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn btn-primary"
                >
                  Publish Job
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </div>
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
    </motion.div>
  );
};

export default PublishJob;
