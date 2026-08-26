import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateRecruiterProfile,
  uploadCompanyLogo,
} from "../../utils/recruiter/recruiterSlice";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile } from "../../utils/auth/authSlice";

const RecruiterProfile = () => {
  const { user, profile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    designation: "",
    website: "",
    aboutCompany: "",
  });
  const [logo, setLogo] = useState(null);
  if (!user || !profile) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.companyName.trim()) {
        setError("Company name is required.");
        return;
      }

      if (!formData.designation.trim()) {
        setError("Designation is required.");
        return;
      }

      if (!formData.aboutCompany.trim()) {
        setError("Company description is required.");
        return;
      }

      if (formData.website.trim()) {
        const website = formData.website.trim();

        const websiteUrl =
          website.startsWith("http://") || website.startsWith("https://")
            ? website
            : `https://${website}`;

        try {
          const url = new URL(websiteUrl);

          if (!url.hostname.includes(".")) {
            setError("Please enter a valid company website URL.");
            return;
          }
        } catch {
          setError("Please enter a valid company website URL.");
          return;
        }
      }

      const updatedRecruiter = await dispatch(
        updateRecruiterProfile({
          ...formData,
          companyName: formData.companyName.trim(),
          designation: formData.designation.trim(),
          aboutCompany: formData.aboutCompany.trim(),
          website: formData.website.trim(),
        }),
      ).unwrap();

      dispatch(updateProfile(updatedRecruiter));

      if (logo) {
        const data = new FormData();
        data.append("logo", logo);

        const updatedLogo = await dispatch(uploadCompanyLogo(data)).unwrap();

        dispatch(
          updateProfile({
            ...updatedRecruiter,
            companyLogo: updatedLogo.companyLogo,
          }),
        );
      }

      setSuccess("Profile updated successfully!");
      setError("");

      document.getElementById("edit_profile_modal").close();
    } catch (err) {
      setError(err?.message || "Failed to update profile.");
      setSuccess("");
    }
  };
  useEffect(() => {
    if (profile) {
      setFormData({
        companyName: profile.companyName || "",
        designation: profile.designation || "",
        website: profile.website || "",
        aboutCompany: profile.aboutCompany || "",
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="avatar placeholder">
                <div className="w-24 rounded-xl flex justify-center items-center bg-primary text-primary-content">
                  {profile.companyLogo ? (
                    <img
                      src={profile.companyLogo}
                      alt={`${profile.companyName || "Company"} logo`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span className="text-3xl font-bold">
                      {(profile.companyName || "C").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h1 className="text-4xl font-bold">
                  {profile.companyName || "Company name not provided"}
                </h1>

                <p className="text-lg opacity-70 mt-1">{user?.role}</p>

                <p className="text-sm opacity-60">
                  {user.fullname} • {user.email}
                </p>

                {profile.website ? (
                  <a
                    href={
                      profile.website.startsWith("http://") ||
                      profile.website.startsWith("https://")
                        ? profile.website
                        : `https://${profile.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary mt-2 inline-block"
                  >
                    {profile.website}
                  </a>
                ) : (
                  <p className="text-sm opacity-60 mt-2">No website added</p>
                )}
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
          <h2 className="card-title text-2xl">About Company</h2>

          <p className="leading-8 text-base-content/80">
            {profile.aboutCompany || "No company description available."}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Company Details</h2>

            <div className="space-y-5">
              <div className="flex justify-between border-b pb-2">
                <span className="opacity-60">Recruiter</span>

                <span className="font-semibold">{user.fullname}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="opacity-60">Company</span>

                <span className="font-semibold">
                  {profile.companyName || "-"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="opacity-60">Designation</span>

                <span className="font-semibold">
                  {profile.designation || "-"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="opacity-60">Website</span>

                <span className="font-semibold break-all">
                  {profile.website || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="opacity-60">Email</span>

                <span className="font-semibold">{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-2xl mb-6">Edit Company Profile</h3>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="alert alert-error mb-5"
              >
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-5">
            <div>
              <label className="label">
                <span className="label-text">
                  Company Name <span className="text-error">*</span>
                </span>
              </label>

              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Company Logo</span>
              </label>

              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setLogo(e.target.files[0])}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">
                  Designation <span className="text-error">*</span>
                </span>
              </label>

              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Website</span>
              </label>

              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">
                  About Company <span className="text-error">*</span>
                </span>
              </label>

              <textarea
                rows={5}
                name="aboutCompany"
                value={formData.aboutCompany}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                required
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
    </div>
  );
};

export default RecruiterProfile;
