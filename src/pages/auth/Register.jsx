import React, { useState, useEffect } from "react";
import register from "../../assets/register.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Building2,
  User,
  Mail,
  Lock,
  MapPin,
  Tag,
  FileText,
  EyeOff,
  Eye,
  UsersRoundIcon,
  Globe,
} from "lucide-react";
import { registerUser } from "../../utils/auth/authSlice";

const EXPERIENCE_OPTIONS = [
  { label: "Fresher", value: 0 },
  { label: "1 Year", value: 1 },
  { label: "2 Years", value: 2 },
  { label: "3 Years", value: 3 },
  { label: "4 Years", value: 4 },
  { label: "5 Years", value: 5 },
  { label: "6 Years", value: 6 },
  { label: "7 Years", value: 7 },
  { label: "8 Years", value: 8 },
  { label: "9 Years", value: 9 },
  { label: "10 Years", value: 10 },
];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status } = useSelector((state) => state.user);
  const loading = status === "loading";

  const [role, setRole] = useState("applicant");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  //   const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    totalExperience: "",
    location: "",
    skills: "",
    companyName: "",
    website: "",
    aboutCompany: "",
    companyLogo: "",
    agreeToTerms: false,
  });
  const [resumeFile, setResumeFile] = useState(null);

  const handleChange = (e) => {
    setFormError(null);
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormError(null);
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setFormError("Resume must be a PDF, DOC, or DOCX file.");
      return;
    }
    if (file.size > maxSize) {
      setFormError("Resume must be under 5MB.");
      return;
    }

    setFormError(null);
    setResumeFile(file);
  };

  const validate = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[A-Za-z][A-Za-z0-9._-]*@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullname.trim()) {
      return "Full name is required.";
    }

    if (!nameRegex.test(formData.fullname.trim())) {
      return "Full name can contain only letters and spaces.";
    }

    if (!formData.email.trim()) {
      return "Email is required.";
    }

    if (!emailRegex.test(formData.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!formData.password) {
      return "Password is required.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!formData.agreeToTerms) {
      return "You must agree to the Terms of Service and Privacy Policy.";
    }

    return null;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload = new FormData();

    payload.append("fullname", formData.fullname);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("role", role);

    if (role === "applicant") {
      if (formData.totalExperience)
        payload.append("totalExperience", formData.totalExperience);

      if (formData.location) payload.append("location", formData.location);

      if (formData.skills.trim()) {
        payload.append(
          "skills",
          JSON.stringify(
            formData.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          ),
        );
      }

      if (resumeFile) payload.append("resume", resumeFile);
    }

    if (role === "recruiter") {
      if (formData.companyName)
        payload.append("companyName", formData.companyName);

      if (formData.website) payload.append("website", formData.website);

      if (formData.aboutCompany)
        payload.append("aboutCompany", formData.aboutCompany);

      if (companyLogo) payload.append("companyLogo", companyLogo);
    }

    try {
      await dispatch(registerUser(payload)).unwrap();

      navigate("/login", {
        replace: true,
        state: {
          success: "Registration successful! Please login.",
        },
      });
    } catch (err) {
      console.log("Registration error:", err);
      setFormError(
        typeof err === "string" ? err : err?.message || "Failed to register!",
      );
    }
  };

  useEffect(() => {
    if (!formError) return;

    const timer = setTimeout(() => {
      setFormError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [formError]);

  return (
    <div className="relative z-10 flex flex-col h-full">
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-6xl bg-base-100 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        >
          <div className="relative flex flex-col p-10 overflow-hidden bg-linear-to-br from-primary/5 via-base-100 to-base-200 border-r border-base-300">
            <div className="flex items-center gap-2 mb-8">
              <UsersRoundIcon size={22} className="text-blue-600" />
              <span className="text-lg font-bold">TalentHub</span>
            </div>

            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-sm text-base-content/70 mb-6">
              Join TalentHub and take the next step in your career or hiring
              journey.
            </p>

            <p className="text-sm font-semibold mb-3">I want to register as</p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setRole("applicant")}
                aria-pressed={role === "applicant"}
                className={`w-full text-left p-4 rounded-xl border-2 transition-colors flex items-start gap-3 ${
                  role === "applicant"
                    ? "border-primary bg-primary/5"
                    : "border-base-300 bg-base-100"
                }`}
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Briefcase size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Applicant</p>
                  <p className="text-xs text-base-content/60">
                    Find jobs, apply and manage your applications.
                  </p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 mt-1 flex items-center justify-center ${
                    role === "applicant" ? "border-primary" : "border-base-300"
                  }`}
                >
                  {role === "applicant" && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("recruiter")}
                aria-pressed={role === "recruiter"}
                className={`w-full text-left p-4 rounded-xl border-2 transition-colors flex items-start gap-3 ${
                  role === "recruiter"
                    ? "border-primary bg-primary/5"
                    : "border-base-300 bg-base-100"
                }`}
              >
                <div className="p-2 rounded-lg bg-base-300 text-base-content">
                  <Building2 size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Recruiter</p>
                  <p className="text-xs text-base-content/60">
                    Post jobs, find talent and manage applicants.
                  </p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 mt-1 flex items-center justify-center ${
                    role === "recruiter" ? "border-primary" : "border-base-300"
                  }`}
                >
                  {role === "recruiter" && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </button>
            </div>

            <div className="pt-8 text-center">
              <div className="divider text-base-content/60">
                <p className="text-sm text-base-content/70">
                  Already have an account?{" "}
                </p>
              </div>
              <Link
                to="/login"
                className="link link-primary font-semibold text-center text-sm"
              >
                Login here
              </Link>
            </div>

            <div className="mt-auto min-h-85 flex items-end justify-center">
              <div className="absolute w-72 h-72 rounded-full bg-primary/10 blur-3xl"></div>
              <img
                src={register}
                alt="Register"
                className="h-75 w-auto object-contain"
              />
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-center">
              Create your account
            </h2>
            <p className="text-center text-sm text-base-content/70 mb-6">
              Fill in your details to get started
            </p>

            <div className="flex w-full items-center mb-6">
              <button
                type="button"
                onClick={() => setRole("applicant")}
                aria-pressed={role === "applicant"}
                className={`card grid h-10 grow place-items-center rounded-box transition-colors cursor-pointer ${
                  role === "applicant"
                    ? "bg-primary text-primary-content"
                    : "bg-base-300 hover:bg-base-300/70"
                }`}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <User size={18} /> Applicant
                </span>
              </button>

              <div className="divider divider-horizontal">OR</div>

              <button
                type="button"
                onClick={() => setRole("recruiter")}
                aria-pressed={role === "recruiter"}
                className={`card grid h-10 grow place-items-center rounded-box transition-colors cursor-pointer ${
                  role === "recruiter"
                    ? "bg-primary text-primary-content"
                    : "bg-base-300 hover:bg-base-300/70"
                }`}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <Building2 size={18} /> Recruiter
                </span>
              </button>
            </div>

            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]"
                >
                  <div className="alert alert-error w-max max-w-[90vw] px-5 py-3 shadow-sm">
                    <span>{formError}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Full Name <span className="text-error">*</span>
                  </legend>
                  <label className="input w-full">
                    <User size={16} className="opacity-50" />
                    <input
                      type="text"
                      name="fullname"
                      placeholder="Enter your full name"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Email Address <span className="text-error">*</span>
                  </legend>
                  <label className="input w-full">
                    <Mail size={16} className="opacity-50" />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Password <span className="text-error">*</span>
                  </legend>
                  <label className="input w-full">
                    <Lock size={16} className="opacity-50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </label>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Confirm Password <span className="text-error">*</span>
                  </legend>
                  <label className="input w-full">
                    <Lock size={16} className="opacity-50" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowConfirmPassword((p) => !p)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </label>
                </fieldset>
              </div>

              {role === "applicant" ? (
                <>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Experience</legend>
                    <select
                      name="totalExperience"
                      className="select w-full"
                      value={formData.totalExperience}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select your experience
                      </option>
                      {EXPERIENCE_OPTIONS.map((opt, index) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </fieldset>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">
                        Current Location
                      </legend>
                      <label className="input w-full">
                        <MapPin size={16} className="opacity-50" />
                        <input
                          type="text"
                          name="location"
                          placeholder="Enter your current location"
                          value={formData.location}
                          onChange={handleChange}
                        />
                      </label>
                    </fieldset>

                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Skills</legend>
                      <label className="input w-full">
                        <Tag size={16} className="opacity-50" />
                        <input
                          type="text"
                          name="skills"
                          placeholder="e.g. React, Node.js, SQL"
                          value={formData.skills}
                          onChange={handleChange}
                        />
                      </label>
                      <p className="label">Optional</p>
                    </fieldset>
                  </div>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Upload Resume</legend>
                    <label
                      htmlFor="resume"
                      className="flex items-center justify-between gap-3 border border-base-300 rounded-lg p-3 cursor-pointer hover:bg-base-200"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-base-content/50" />
                        <div>
                          <p className="text-sm font-medium">
                            {resumeFile
                              ? resumeFile.name
                              : "Upload your resume"}
                          </p>
                          <p className="text-xs text-base-content/50">
                            PDF, DOC or DOCX (Max 5MB)
                          </p>
                        </div>
                      </div>
                      <span className="btn btn-sm btn-outline">Browse</span>
                      <input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="label">Optional</p>
                  </fieldset>
                </>
              ) : (
                <>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Company Name</legend>

                    <label className="input w-full">
                      <Building2 size={16} className="opacity-50" />
                      <input
                        type="text"
                        name="companyName"
                        placeholder="Enter your company name"
                        value={formData.companyName}
                        onChange={handleChange}
                      />
                    </label>
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Company Logo</legend>
                    <label className="input w-full">
                      <Globe size={16} className="opacity-50" />
                      <input
                        type="file"
                        className="file-input"
                        name="companyLogo"
                        onChange={(e) => setCompanyLogo(e.target.files[0])}
                      />
                    </label>
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Company Website</legend>
                    <input
                      type="url"
                      name="website"
                      className="input w-full"
                      placeholder="https://yourcompany.com"
                      value={formData.website}
                      onChange={handleChange}
                    />
                    <p className="label">Optional</p>
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">About Company</legend>
                    <textarea
                      name="aboutCompany"
                      rows={3}
                      className="textarea w-full"
                      placeholder="Briefly describe your company"
                      value={formData.aboutCompany}
                      onChange={handleChange}
                    />
                    <p className="label">Optional</p>
                  </fieldset>
                </>
              )}

              <label className="flex items-start gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  className="checkbox checkbox-sm mt-0.5"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="link link-primary">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="link link-primary">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Create Account"
                )}
              </motion.button>

              <p className="text-center text-xs text-base-content/60">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="link link-primary">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="link link-primary">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
