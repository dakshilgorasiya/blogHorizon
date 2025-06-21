import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Shield,
} from "lucide-react";
import { server } from "../../constants.js";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordFormat, setPasswordFormat] = useState({
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    hasLength: false,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);

    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const hasLength = password.length >= 8;

    setPasswordFormat({
      hasNumber,
      hasUpperCase,
      hasLowerCase,
      hasSpecialChar,
      hasLength,
    });

    // Check password match when password changes
    if (confirmPassword) {
      setPasswordMatch(confirmPassword === password);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
    setPasswordMatch(confirmPassword === password || confirmPassword === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !passwordFormat.hasNumber ||
      !passwordFormat.hasUpperCase ||
      !passwordFormat.hasLowerCase ||
      !passwordFormat.hasSpecialChar ||
      !passwordFormat.hasLength
    ) {
      setError("Password is not strong enough");
      return;
    }

    if (!passwordMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${server}/user/reset-password/${token}`,
        {
          password,
          confirmPassword,
        }
      );
      setSuccess(true);
      setLoading(false);
      setMessage(response?.data?.message);
    } catch (err) {
      setError(err?.response?.data?.message);
      setLoading(false);
    }
  };

  const passwordRequirements = [
    {
      key: "hasLength",
      text: "At least 8 characters long",
      met: passwordFormat.hasLength,
    },
    {
      key: "hasUpperCase",
      text: "At least one uppercase letter",
      met: passwordFormat.hasUpperCase,
    },
    {
      key: "hasLowerCase",
      text: "At least one lowercase letter",
      met: passwordFormat.hasLowerCase,
    },
    {
      key: "hasNumber",
      text: "At least one number",
      met: passwordFormat.hasNumber,
    },
    {
      key: "hasSpecialChar",
      text: "At least one special character",
      met: passwordFormat.hasSpecialChar,
    },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Set New Password
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-purple-100"
            >
              Create a strong password for your account
            </motion.p>
          </div>

          {/* Form Container */}
          <div className="p-8">
            {!success ? (
              <form onSubmit={handleSubmit}>
                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4"
                >
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    htmlFor="password"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="Enter your new password"
                      onChange={handlePasswordChange}
                      disabled={success}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff
                          size={20}
                          className="text-gray-400 hover:text-gray-600"
                        />
                      ) : (
                        <Eye
                          size={20}
                          className="text-gray-400 hover:text-gray-600"
                        />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Password Requirements */}
                <AnimatePresence>
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6"
                    >
                      <div className="bg-gray-50/50 rounded-xl p-4 space-y-2">
                        <div className="flex items-center space-x-2 mb-3">
                          <Shield size={16} className="text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Password Requirements
                          </span>
                        </div>
                        {passwordRequirements.map((requirement, index) => (
                          <motion.div
                            key={requirement.key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-2"
                          >
                            {requirement.met ? (
                              <Check size={16} className="text-green-500" />
                            ) : (
                              <X size={16} className="text-red-400" />
                            )}
                            <span
                              className={`text-sm ${
                                requirement.met
                                  ? "text-green-700"
                                  : "text-gray-600"
                              }`}
                            >
                              {requirement.text}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Confirm Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6"
                >
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-gray-50/50 hover:bg-white ${
                        confirmPassword && !passwordMatch
                          ? "border-red-300 focus:border-red-500"
                          : confirmPassword && passwordMatch
                          ? "border-green-300 focus:border-green-500"
                          : "border-gray-200 focus:border-purple-500"
                      }`}
                      placeholder="Confirm your new password"
                      onChange={handleConfirmPasswordChange}
                      disabled={success}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff
                          size={20}
                          className="text-gray-400 hover:text-gray-600"
                        />
                      ) : (
                        <Eye
                          size={20}
                          className="text-gray-400 hover:text-gray-600"
                        />
                      )}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  <AnimatePresence>
                    {confirmPassword && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 flex items-center space-x-2"
                      >
                        {passwordMatch ? (
                          <>
                            <Check size={16} className="text-green-500" />
                            <span className="text-sm text-green-700">
                              Passwords match
                            </span>
                          </>
                        ) : (
                          <>
                            <X size={16} className="text-red-400" />
                            <span className="text-sm text-red-600">
                              Passwords do not match
                            </span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="mb-6"
                    >
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                        <AlertCircle
                          size={20}
                          className="text-red-600 flex-shrink-0"
                        />
                        <p className="text-red-700 font-medium">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || !allRequirementsMet || !passwordMatch}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Save New Password</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Back to Login Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center"
                >
                  <Link
                    to="/login"
                    className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Login</span>
                  </Link>
                </motion.div>
              </form>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Password Updated!
                  </h2>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <p className="text-green-700 font-medium">
                      {message || "Your password has been successfully updated"}
                    </p>
                  </div>
                  <p className="text-gray-600">
                    You can now login with your new password
                  </p>
                </motion.div>

                {/* Login Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>Continue to Login</span>
                      <ArrowRight size={20} />
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ResetPassword;
