import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CircleCheckBig, CircleX, BriefcaseBusiness } from "lucide-react";
import {
  updateApplicantProfile,
  uploadApplicantPhoto,
  uploadResume,
} from "../../utils/applicant/applicantSlice";

import { updateProfile } from "../../utils/auth/authSlice";

import { motion, AnimatePresence } from "framer-motion";

const ApplicantProfile = () => {
  const { user, profile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("experience");
  console.log(profile);
  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    skills: "",
    experience: [],
    totalExperience: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const completedItems = [
    !!profile.photo,
    !!profile.resume,
    profile.skills.length > 0,
    profile.education.length > 0,
    profile.experience.length > 0,
  ];

  const percentage = Math.round(
    (completedItems.filter(Boolean).length / completedItems.length) * 100,
  );

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        experience: formData.experience,
      };
      const updatedApplicant = await dispatch(
        updateApplicantProfile(payload),
      ).unwrap();

      dispatch(updateProfile(updatedApplicant));

      if (photo) {
        const data = new FormData();

        data.append("photo", photo);

        const uploaded = await dispatch(uploadApplicantPhoto(data)).unwrap();

        dispatch(
          updateProfile({
            ...updatedApplicant,
            photo: uploaded.photo,
          }),
        );
      }

      if (resume) {
        const data = new FormData();

        data.append("resume", resume);

        const uploaded = await dispatch(uploadResume(data)).unwrap();

        dispatch(
          updateProfile({
            ...updatedApplicant,
            resume: uploaded.resume,
          }),
        );
      }

      setSuccess("Profile updated successfully!");
      setError("");

      document.getElementById("edit_profile_modal").close();
    } catch (err) {
      setError(err);
      setSuccess("");
    }
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          company: "",
          position: "",
        },
      ],
    });
  };
  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    });
  };
  const handleExperienceChange = (index, e) => {
    const updatedExperience = [...formData.experience];

    updatedExperience[index][e.target.name] = e.target.value;

    setFormData({
      ...formData,
      experience: updatedExperience,
    });
  };

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || "",
        location: profile.location || "",
        skills: profile.skills?.join(", ") || "",
        totalExperience: profile.totalExperience || "",
        experience: profile.experience || [],
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!success && !error) return;

    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success, error]);

  if (!user || !profile) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="avatar placeholder">
                <div className="w-24 flex items-center justify-center rounded-xl bg-primary text-primary-content">
                  {profile?.photo ? (
                    <img src={profile.photo} alt={user?.fullname} />
                  ) : (
                    <span className="text-3xl font-bold">
                      {user?.fullname?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h1 className="text-4xl font-bold">{user.fullname}</h1>

                <div className="badge badge-primary badge-outline mt-2">
                  Applicant
                </div>

                <div className="flex items-center gap-2 mt-2 text-lg">
                  <BriefcaseBusiness size={18} className="text-primary" />
                  <span className="text-sm font-semibold">
                    {profile.totalExperience} Years of Experience
                  </span>
                </div>

                <p className="mt-3 text-sm opacity-70">
                  {profile.location || "Location not added"}
                </p>

                <p className="text-sm opacity-70">✉ {user.email}</p>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() =>
                document.getElementById("edit_profile_modal").showModal()
              }
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h2 className="card-title">About Me</h2>

          <p className="leading-8">
            {profile.bio || "Tell recruiters about yourself."}
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div role="tablist" className="tabs tabs-border">
              <button
                role="tab"
                className={`tab ${
                  activeTab === "experience" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("experience")}
              >
                Experience
              </button>

              <button
                role="tab"
                className={`tab ${activeTab === "skills" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("skills")}
              >
                Skills
              </button>

              <button
                role="tab"
                className={`tab ${
                  activeTab === "education" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("education")}
              >
                Education
              </button>
            </div>

            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                {activeTab === "experience" && (
                  <div className="space-y-5">
                    {profile.experience.length > 0 ? (
                      profile.experience.map((exp) => (
                        <div
                          key={exp._id}
                          className="border-l-4 border-primary pl-5 py-1"
                        >
                          <h3 className="font-bold text-lg">{exp.position}</h3>

                          <p className="opacity-70">@ {exp.company}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 opacity-60">
                        No work experience added yet.
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "skills" && (
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.length > 0 ? (
                      profile.skills.map((skill) => (
                        <div
                          key={skill}
                          className="badge badge-primary badge-lg"
                        >
                          {skill}
                        </div>
                      ))
                    ) : (
                      <div className="text-center w-full py-10 opacity-60">
                        No skills added.
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "education" && (
                  <div className="space-y-5">
                    {profile.education.length > 0 ? (
                      profile.education.map((edu) => (
                        <div
                          key={edu._id}
                          className="border-l-4 border-secondary pl-5 pb-3"
                        >
                          <h3 className="text-md font-medium">
                            High School: {edu.school}
                          </h3>

                          <h3 className="text-md font-medium">
                            Degree: {edu.degree}
                          </h3>

                          <p className="text-sm font-semibold">
                            Graduation: {edu.year}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 opacity-60">
                        No education added.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <h2 className="card-title flex items-center justify-start">
                  Profile Completion{" "}
                  <span className="text-sm">{percentage} %</span>
                </h2>

                <progress
                  className="progress progress-success"
                  value={percentage}
                  max="100"
                />

                <ul className="space-y-3 mt-5">
                  <li className="flex justify-between">
                    <span>Photo</span>
                    <span>
                      {profile.photo ? (
                        <CircleCheckBig className="text-green-600" />
                      ) : (
                        <CircleX className="text-red-600" />
                      )}
                    </span>
                  </li>

                  <li className="flex justify-between">
                    <span>Resume</span>
                    <span>
                      {profile.resume ? (
                        <CircleCheckBig className="text-green-600" />
                      ) : (
                        <CircleX className="text-red-600" />
                      )}
                    </span>
                  </li>

                  <li className="flex justify-between">
                    <span>Skills</span>
                    <span>
                      {profile.skills.length ? (
                        <CircleCheckBig className="text-green-600" />
                      ) : (
                        <CircleX className="text-red-600" />
                      )}
                    </span>
                  </li>

                  <li className="flex justify-between">
                    <span>Education</span>
                    <span>
                      {profile.education.length ? (
                        <CircleCheckBig className="text-green-600" />
                      ) : (
                        <CircleX className="text-red-600" />
                      )}
                    </span>
                  </li>

                  <li className="flex justify-between">
                    <span>Experience</span>
                    <span>
                      {profile.experience.length ? (
                        <CircleCheckBig className="text-green-600" />
                      ) : (
                        <CircleX className="text-red-600" />
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <h2 className="card-title">Resume</h2>

                {profile.resume ? (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    View Resume
                  </a>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm opacity-60">No resume uploaded.</p>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        document
                          .getElementById("edit_profile_modal")
                          .showModal()
                      }
                    >
                      Upload Resume
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-2xl mb-6">Edit Applicant Profile</h3>

          <div className="space-y-5">
            <div>
              <label className="label">
                <span className="label-text font-medium">Profile Photo</span>
              </label>

              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Upload / Edit Resume</span>
              </label>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setResume(e.target.files[0])}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Location</span>
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="e.g. Bangalore, India"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Total Experience (Years)
                </span>
              </label>

              <input
                type="number"
                min="0"
                name="totalExperience"
                value={formData.totalExperience}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-medium">Experience</span>
              </label>

              <div className="space-y-4">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <input
                      type="text"
                      name="company"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, e)}
                      className="input input-bordered w-full"
                      placeholder="Company"
                    />

                    <input
                      type="text"
                      name="position"
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(index, e)}
                      className="input input-bordered w-full"
                      placeholder="Position"
                    />

                    <button
                      type="button"
                      className="btn btn-error btn-sm"
                      onClick={() => removeExperience(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-outline btn-primary"
                  onClick={addExperience}
                >
                  + Add Experience
                </button>
              </div>
            </div>
            <div>
              <label className="label">
                <span className="label-text font-medium">Skills</span>
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="React, Node.js, MongoDB"
              />

              <label className="label">
                <span className="label-text-alt">
                  Separate skills with commas.
                </span>
              </label>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Bio</span>
              </label>

              <textarea
                rows={5}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                placeholder="Tell recruiters about yourself..."
              />
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>

            <button className="btn btn-primary" onClick={handleSave}>
              Save Changes
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

export default ApplicantProfile;
