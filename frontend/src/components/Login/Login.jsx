import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, verifyOtp } from "../../features/auth/authReducers.js";
import { setUser, setErrorMessage } from "../../features/auth/authSlice.js";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { server } from "../../constants.js";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState(null);

  const apiError = useSelector((state) => state.auth.error);

  const loading = useSelector((state) => state.auth.loading);

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);

  useEffect(() => {
    if (user?.accessToken) {
      navigate("/");
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    }

    setError(null);

    setOtpSent(true);
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
    <>
      <div className="flex justify-center items-center min-h-screen p-5 bg-accent">
        <div className="border-2 border-black rounded-lg p-4 shadow-md w-full max-w-md bg-background">
          <h1 className="text-4xl text-center font-extrabold mt-8">Login</h1>

          <div className="mt-20 p-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <label className="text-lg inline-block" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>

              <div className="mb-4 box-border">
                <label className="text-lg inline-block" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>

              {otpSent && (
                <div className="flex justify-center my-8">
                  <p className="text-green-600 font-medium text-md text-center">
                    OTP sent to your email
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
                <div className="flex justify-center m-10">
                  <p className="text-red-500 font-medium text-md">{error}</p>
                </div>
              )}

              {!otpSent && (
                <div className="flex justify-center mb-10">
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
                      onClick={(e) => handleSubmit(e)}
                      className="bg-gray-800 hover:bg-highlight text-white font-bold py-2 px-4 rounded-lg shadow-md"
                    >
                      Send OTP
                    </button>
                  )}
                </div>
              )}

              {otpSent && (
                <div className="flex justify-center mb-10">
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
                      Login
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
                  Don't have an account?{" "}
                  <Link to="/register" className="text-highlight">
                    Register here
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

export default Login;
