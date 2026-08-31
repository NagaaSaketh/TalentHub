import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { EyeOff, Eye, UsersRoundIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, clearError } from "../../utils/auth/authSlice";
import loginImg from "../../assets/loginpage.jpg";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [success, setSuccess] = useState("");
  const { error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const user = await dispatch(loginUser({ email, password })).unwrap();
      navigate(user.role === "recruiter" ? "/recruiter" : "/applicant", {
        replace: true,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      dispatch(clearError());
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, dispatch]);

  useEffect(() => {
    if (!location.state?.success) return;

    setSuccess(location.state.success);

    navigate(location.pathname, {
      replace: true,
      state: null,
    });

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-base-100 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="card-body">
          <div className="flex items-center gap-2 mb-2">
            <UsersRoundIcon size={22} className="text-blue-600" />
            <span className="text-lg font-bold">TalentHub</span>
          </div>

          <h2 className="text-2xl font-bold text-center">Welcome Back!</h2>
          <p className="text-center text-sm text-base-content/70 mb-4">
            Login to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Email Address</legend>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="input w-full"
                  required
                  placeholder="Enter your email address"
                />
              </fieldset>
            </div>

            <fieldset className="relative fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                type={showPass ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="input w-full"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                aria-label={showPass ? "Hide password" : "Show password"}
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </fieldset>

            <div className="flex items-center justify-end text-xs">
              <Link
                to="/forgot-password"
                className="link link-primary font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="btn btn-primary w-full"
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="link link-primary">
              Register
            </Link>
          </p>
        </div>

        <div className="px-4 pb-4">
          <img
            src={loginImg}
            alt="login-img"
            className="w-full h-auto object-contain"
          />
        </div>
      </motion.div>
      <AnimatePresence>
        {error && (
          <div className="toast toast-top toast-center z-50">
            <motion.div
              key="login-error-toast"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.25 }}
              role="alert"
              className="alert alert-error"
            >
              <span>{error}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
    </div>
  );
};

export default Login;