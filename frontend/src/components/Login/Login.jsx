import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, verifyOtp } from "../../features/auth/authReducers.js";
import { setUser, setErrorMessage } from "../../features/auth/authSlice.js";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Key,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { server } from "../../constants.js";
import { sendNotification } from "../../features/notification/notificationSlice.js";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);

  const apiError = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
    if (apiError === "OTP attempts exceeded") {
      setOtpSent(false);
    }
  }, [apiError]);

  useEffect(() => {
    if (user) setOtpSent(true);
  }, [user]);

  useEffect(() => {
    if (user?.accessToken) {
      if (user.profileCompleted) {
        navigate("/");
      } else {
        navigate("/complete-profile");
      }
    }
  }, [user]);

  const handleLoginSuccess = async (response) => {
    const token = response.credential;

    if (!token) {
      console.error("NO TOKEN RECEIVED");
    }

    try {
      const response = await axios
        .post(
          `${server}/user/google-oauth`,
          { token },
          {
            withCredentials: true,
          }
        )
        .then((res) => res.data);

      dispatch(
        sendNotification({
          message: "Logged in successfully",
          type: "success",
        })
      );
      dispatch(setUser(response.data));
    } catch (err) {
      console.log(err.response.data.message);
      dispatch(
        setErrorMessage(err.response?.data?.message || "Something went wrong")
      );
    }
  };

  const handleLoginFailure = (response) => {
    setError("Something went wrong. Please try again");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    }

    setError(null);
    dispatch(login({ email, password }));
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError(null);
    dispatch(verifyOtp({ otp: otp, email: email }));
  };

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
        {/* Main Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-purple-100"
            >
              Sign in to continue your journey
            </motion.p>
          </div>

          {/* Form Container */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFormFocused(true)}
                    onBlur={() => setIsFormFocused(false)}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="password"
                >
                  Password
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
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Forgot Password Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6 text-right"
              >
                <Link
                  to="/forgot-password"
                  className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors duration-200"
                >
                  Forgot Password?
                </Link>
              </motion.div>

              {/* OTP Sent Message */}
              <AnimatePresence>
                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="mb-6"
                  >
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                      <CheckCircle
                        size={20}
                        className="text-green-600 flex-shrink-0"
                      />
                      <p className="text-green-700 font-medium">
                        OTP sent to your email successfully
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* OTP Field */}
              <AnimatePresence>
                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      htmlFor="otp"
                    >
                      Verification Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={20} className="text-gray-400" />
                      </div>
                      <input
                        id="otp"
                        type="text"
                        name="otp"
                        value={otp}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-gray-50/50 hover:bg-white text-center text-2xl font-mono tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                        onChange={handleOtpChange}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                transition={{ delay: 0.7 }}
                className="mb-8"
              >
                {!otpSent ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleOtpSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Login</span>
                        <CheckCircle size={20} />
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>

              {/* Success Message */}
              <AnimatePresence>
                {user?.accessToken && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="mb-6"
                  >
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                      <CheckCircle
                        size={20}
                        className="text-green-600 flex-shrink-0"
                      />
                      <p className="text-green-700 font-medium">
                        Login successful! Redirecting...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    OR
                  </span>
                </div>
              </motion.div>

              {/* Google Login */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mb-8"
              >
                <GoogleOAuthProvider
                  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                >
                  <div className="flex justify-center">
                    <div className="w-full">
                      <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginFailure}
                        text="continue_with"
                        theme="outline"
                        size="large"
                        width="100%"
                        style={{
                          width: "100%",
                          borderRadius: "12px",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </div>
                  </div>
                </GoogleOAuthProvider>
              </motion.div>

              {/* Register Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-center"
              >
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors duration-200"
                  >
                    Create Account
                  </Link>
                </p>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
