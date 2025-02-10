import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { register, verifyOtp } from "../../features/auth/authReducers.js";
import { getInterests } from "../../features/constants/constantsReducers.js";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

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
    if (interests.length === 0 && !interestsLoading) {
      dispatch(getInterests());
    }
  }, []);

  useEffect(() => {
    if (user?.accessToken) {
      navigate("/");
    }
  }, [user])

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
    setOtpSent(true);
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

      dispatch(setUser(response.data));

      if (!response.data.isProfileComplete) {
        navigate("/complete-profile");
      } else {
        navigate("/");
      }
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

  

  return (
    <>
      <div className="flex justify-center items-center min-h-screen p-5 bg-accent">
        <div className="border-2 border-black rounded-lg p-4 shadow-md w-full max-w-md bg-background">
          <h1 className="text-4xl text-center font-extrabold mt-8">Register</h1>

          <div className="mt-20 p-3">
            <form onSubmit={handleSendOtp}>
              <div className="mb-8">
                <label className="text-lg inline-block" htmlFor="userName">
                  Username
                </label>
                <input
                  id="userName"
                  type="text"
                  name="userName"
                  className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-8">
                <label className="text-lg inline-block" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4 box-border">
                <label className="text-lg inline-block" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
                  onChange={(e) => {
                    handleChange(e);
                    handlePasswordChange(e);
                  }}
                />

                <div className="flex items-center gap-2 mt-2">
                  <ul className="list-disc list-inside ml-6">
                    <li
                      className={`text-sm ${
                        passwordFormat.hasLength
                          ? "hidden"
                          : "marker: text-red-500"
                      }`}
                    >
                      {" "}
                      At least 8 characters long
                    </li>
                    <li
                      className={`text-sm ${
                        passwordFormat.hasUpperCase
                          ? "hidden"
                          : "marker: text-red-500"
                      }`}
                    >
                      {" "}
                      At least one uppercase letter
                    </li>
                    <li
                      className={`text-sm ${
                        passwordFormat.hasLowerCase
                          ? "hidden"
                          : "marker: text-red-500"
                      }`}
                    >
                      {" "}
                      At least one lowercase letter
                    </li>
                    <li
                      className={`text-sm ${
                        passwordFormat.hasNumber
                          ? "hidden"
                          : "marker: text-red-500"
                      }`}
                    >
                      {" "}
                      At least one number
                    </li>
                    <li
                      className={`text-sm ${
                        passwordFormat.hasSpecialChar
                          ? "hidden"
                          : "marker: text-red-500"
                      }`}
                    >
                      {" "}
                      At least one special character
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-4 mt-8 box-border">
                <label
                  className="text-lg inline-block"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
                  onChange={(e) => {
                    handleChange(e);
                    handleConfirmPasswordChange(e);
                  }}
                />

                <div className="flex items-center gap-2 mt-2">
                  <ul className="list-item list-inside ml-6">
                    <li
                      className={`text-sm ${
                        passwordMatch ? "hidden" : "marker: text-red-500"
                      }`}
                    >
                      Confirm password should match password
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-4 box-border">
                <label className="text-lg inline-block" htmlFor="avatar">
                  Profile Photo
                </label>
                <input
                  id="avatar"
                  type="file"
                  name="avatar"
                  className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              {avatarPreview && (
                <div className="mb-4 box-border">
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                </div>
              )}

              <div className="mb-4 box-border">
                <label className="text-lg inline-block" htmlFor="bio">
                  Bio
                </label>
                <input
                  id="bio"
                  type="text"
                  name="bio"
                  className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4 mt-10 box-border">
                <label className="text-lg block">Interests :</label>
                <ul className="flex flex-wrap justify-center gap-1 p-0">
                  {interests.map((interest, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-1 min-w-[120px]}"
                    >
                      <input
                        type="checkbox"
                        id={interest}
                        name="interests"
                        value={interest}
                        onChange={handleInterestsChange}
                        className="ml-1 cursor-pointer border-priary rounded-md hover:ring-2 hover:ring-highlight hover:border-gray-700 transition duration-200"
                      />

                      <label htmlFor={interest}>{interest}</label>
                    </li>
                  ))}
                </ul>
                {interestsLoading && (
                  <div className="flex justify-center mt-4">
                    <p className="text-gray-600 font-medium text-md">
                      Loading interests...
                    </p>
                  </div>
                )}
              </div>

              {otpSent && (
                <div className="flex justify-center my-8">
                  <p className="text-green-600 font-medium text-md text-center">
                    Your account has been created. Please enter the OTP sent to
                    your email.
                  </p>
                </div>
              )}

              {otpSent && (
                <div className="mb-4 box-border">
                  <label className="text-lg inline-block" htmlFor="otp">
                    OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    name="otp"
                    className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
                    onChange={handleOtpChange}
                  />
                </div>
              )}

              {error && (
                <div className="flex justify-center mt-10">
                  <p className="text-red-500 font-medium text-md">{error}</p>
                </div>
              )}

              {!otpSent && (
                <div className="flex justify-center my-8">
                  {loading ? (
                    <button
                      className="bg-gray-800 hover:bg-highlight text-white font-bold py-2 px-4 rounded-lg shadow-md"
                      disabled
                    >
                      Loading...
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleSendOtp(e)}
                      className="bg-gray-800 hover:bg-highlight text-white font-bold py-2 px-4 rounded-lg shadow-md"
                    >
                      Send OTP
                    </button>
                  )}
                </div>
              )}

              {otpSent && (
                <div className="flex justify-center my-8">
                  {loading ? (
                    <button
                      className="bg-gray-800 hover:bg-highlight text-white font-bold py-2 px-4 rounded-lg shadow-md"
                      disabled
                    >
                      Loading...
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleOtpSubmit(e)}
                      className="bg-gray-800 hover:bg-highlight text-white font-bold py-2 px-4 rounded-lg shadow-md"
                    >
                      Verify OTP
                    </button>
                  )}
                </div>
              )}

              {user?.accessToken && (
                <div className="flex justify-center my-8">
                  <p className="text-green-600 font-medium text-md text-center">
                    OTP verified successfully. Redirecting to home page...
                  </p>
                </div>
              )}

              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              >
                <div className="mb-10">
                  <h1 className="text-center text-lg font-bold">OR</h1>
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                    text="continue_with"
                  />
                </div>
              </GoogleOAuthProvider>

              <div className="flex justify-center">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="text-highlight">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
