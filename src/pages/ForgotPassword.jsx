import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UsersRoundIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../utils/auth/authSlice";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        forgotPassword({
          email,
          password,
          confirmPassword,
        }),
      ).unwrap();

      navigate("/login", {
        state: {
          success: "Password reset successfully! Please login.",
        },
        replace: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-base-100 rounded-2xl shadow-2xl"
      >
        <div className="card-body">
          <div className="flex items-center gap-2 mb-2">
            <UsersRoundIcon size={22} className="text-blue-600" />
            <span className="text-lg font-bold">TalentHub</span>
          </div>

          <h2 className="text-2xl font-bold text-center">Forgot Password?</h2>

          <p className="text-center text-sm text-base-content/70 mb-5">
            Enter your registered email address and we'll send you a password
            reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email Address</legend>

              <input
                type="email"
                className="input w-full"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">New Password</legend>

              <input
                type="password"
                className="input w-full"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Confirm Password</legend>

              <input
                type="password"
                className="input w-full"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </fieldset>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="text-center mt-5">
            <Link to="/login" className="link link-primary">
              ← Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
