import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { register, verifyOtp } from "../../features/auth/authReducers.js";
import { getInterests } from "../../features/constants/constantsReducers.js";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { server } from "../../constants.js";
import { sendNotification } from "../../features/notification/notificationSlice.js";
import { setUser, setErrorMessage } from "../../features/auth/authSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Camera,
  Edit3,
  Key,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    avatar: null,
    interests: [],
  });

  const [avatarPreview, setAvatarPreview] = useState(null);

  const [passwordFormat, setPasswordFormat] = useState({
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    hasLength: false,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  const [error, setError] = useState(null);

  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const authError = useSelector((state) => state.auth.error);

  const interestsError = useSelector((state) => state.constants.error);

  const loading = useSelector((state) => state.auth.loading);

  const interests = useSelector((state) => state.constants.interests);

  const interestsLoading = useSelector((state) => state.constants.loading);

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (authError === "OTP attempts exceeded") {
      setOtpSent(false);
      setError("OTP attempts exceeded. Please try again later.");
    }
  }, [authError]);

  useEffect(() => {
    if (interests.length === 0 && !interestsLoading) {
      dispatch(getInterests());
    }
  }, []);

  useEffect(() => {
    if (user?.accessToken) {
      navigate("/");
    }
    if (user) {
      setOtpSent(true);
    }
  }, [user]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    } else if (interestsError) {
      setError(interestsError);
    }
  }, [authError, interestsError]);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
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
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    const password = formData.password;
    setPasswordMatch(confirmPassword === password);
    if (confirmPassword == "") {
      setPasswordMatch(true);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files[0];
    setFormData({
      ...formData,
      avatar: file,
    });
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleInterestsChange = (e) => {
    if (e.target.checked) {
      setFormData({
        ...formData,
        interests: [...formData.interests, e.target.value],
      });
    } else {
      setFormData({
        ...formData,
        interests: formData.interests.filter(
          (interest) => interest !== e.target.value
        ),
      });
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();

    if (
      formData.userName == "" ||
      formData.email == "" ||
      formData.password == "" ||
      formData.confirmPassword == "" ||
      formData.avatar == null
    ) {
      setError("All fields are required");
      return;
    }

    if (
      !passwordFormat.hasNumber ||
      !passwordFormat.hasUpperCase ||
      !passwordFormat.hasLowerCase ||
      !passwordFormat.hasSpecialChar ||
      !passwordFormat.hasLength
    ) {
      setError("Password is not strong enough.");
      return;
    }

    if (!passwordMatch) {
      setError("Passwords do not match");
      return;
    }

    if (formData.interests.length < 3) {
      setError("Please select at three one interest");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    data.delete("confirmPassword");
    setError(null);
    dispatch(register(data));
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError(null);
    dispatch(verifyOtp({ otp: otp, email: formData.email }));
  };

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
      console.log(err);
      console.log(err.response.data.message);
      dispatch(
        setErrorMessage(err.response?.data?.message || "Something went wrong")
      );
    }
  };

  const handleLoginFailure = (response) => {
    setError("Something went wrong. Please try again");
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
        className="relative w-full max-w-2xl"
      >
        {/* Main Register Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Create Account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-purple-100"
            >
              Join us and start your journey today
            </motion.p>
          </div>

          {/* Form Container */}
          <div className="p-8">
            <form onSubmit={handleSendOtp}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="md:col-span-1"
                >
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    htmlFor="userName"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="userName"
                      type="text"
                      name="userName"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="Choose a username"
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="md:col-span-1"
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
                      name="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="Enter your email"
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
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
                    type="password"
                    name="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    placeholder="Create a strong password"
                    onChange={(e) => {
                      handleChange(e);
                      handlePasswordChange(e);
                    }}
                  />
                </div>

                {/* Password Requirements */}
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div
                      className={`flex items-center space-x-2 ${
                        passwordFormat.hasLength
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {passwordFormat.hasLength ? (
                        <CheckCircle size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                      <span>At least 8 characters</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${
                        passwordFormat.hasUpperCase
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {passwordFormat.hasUpperCase ? (
                        <CheckCircle size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                      <span>One uppercase letter</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${
                        passwordFormat.hasLowerCase
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {passwordFormat.hasLowerCase ? (
                        <CheckCircle size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                      <span>One lowercase letter</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${
                        passwordFormat.hasNumber
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {passwordFormat.hasNumber ? (
                        <CheckCircle size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                      <span>One number</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 md:col-span-2 ${
                        passwordFormat.hasSpecialChar
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {passwordFormat.hasSpecialChar ? (
                        <CheckCircle size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                      <span>One special character</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-6"
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
                    type="password"
                    name="confirmPassword"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    placeholder="Confirm your password"
                    onChange={(e) => {
                      handleChange(e);
                      handleConfirmPasswordChange(e);
                    }}
                  />
                </div>
                {!passwordMatch && (
                  <div className="mt-2 flex items-center space-x-2 text-red-500 text-sm">
                    <XCircle size={16} />
                    <span>Passwords do not match</span>
                  </div>
                )}
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Profile Photo Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="md:col-span-1"
                >
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    htmlFor="avatar"
                  >
                    Profile Photo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Camera size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="avatar"
                      type="file"
                      name="avatar"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-gray-50/50 hover:bg-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                  {avatarPreview && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="h-20 w-20 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                      />
                    </div>
                  )}
                </motion.div>

                {/* Bio Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="md:col-span-1"
                >
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    htmlFor="bio"
                  >
                    Bio
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                      <Edit3 size={20} className="text-gray-400" />
                    </div>
                    <textarea
                      id="bio"
                      name="bio"
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-gray-50/50 hover:bg-white resize-none"
                      placeholder="Tell us about yourself"
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Interests Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-6"
              >
                <label className="block text-gray-700 font-semibold mb-4">
                  Interests
                </label>
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200">
                  {interestsLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2
                        size={24}
                        className="animate-spin text-purple-600 mr-2"
                      />
                      <span className="text-gray-600 font-medium">
                        Loading interests...
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {interests.map((interest, index) => (
                        <label
                          key={index}
                          htmlFor={interest}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors duration-200"
                        >
                          <input
                            type="checkbox"
                            id={interest}
                            name="interests"
                            value={interest}
                            onChange={handleInterestsChange}
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {interest}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* OTP Sent Message */}
              <AnimatePresence>
                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="mt-6"
                  >
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                      <CheckCircle
                        size={20}
                        className="text-green-600 flex-shrink-0"
                      />
                      <p className="text-green-700 font-medium">
                        Account created successfully! Please enter the OTP sent
                        to your email.
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
                    className="mt-6"
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
                    className="mt-6"
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
                transition={{ delay: 1.1 }}
                className="mt-8"
              >
                {!otpSent ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
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
                        <span>Verify & Complete</span>
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
                    className="mt-6"
                  >
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                      <CheckCircle
                        size={20}
                        className="text-green-600 flex-shrink-0"
                      />
                      <p className="text-green-700 font-medium">
                        Registration successful! Redirecting to home page...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="relative mt-8 mb-8"
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

              {/* Google Registration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
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

              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-center"
              >
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors duration-200"
                  >
                    Sign In
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

export default Register;
