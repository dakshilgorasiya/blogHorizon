import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
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
    setPasswordMatch(confirmPassword === password);
    if (confirmPassword == "") {
      setPasswordMatch(true);
    }
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
      !passwordFormat.hasLength ||
      !passwordMatch
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

  return (
    <>
      <div className="flex justify-center items-center min-h-screen p-5 bg-accent">
        <div className="border-2 border-black rounded-lg p-4 shadow-md w-full max-w-md bg-background">
          <h1 className="text-4xl text-center font-extrabold mt-8">
            Set New Password
          </h1>

          <div className="mt-20 p-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <label className="text-lg inline-block" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  disabled={success}
                  className={`border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2 ${
                    success ? "hover:cursor-not-allowed" : ""
                  }`}
                  onChange={(e) => {
                    setPassword(e.target.value);
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

              <div className="mb-8">
                <label
                  className="text-lg inline-block"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  disabled={success}
                  className={`border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2 ${
                    success ? "hover:cursor-not-allowed" : ""
                  }`}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
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

              {error && (
                <div className="flex justify-center my-10">
                  <p className="text-red-500 font-medium text-md">{error}</p>
                </div>
              )}

              {message && (
                <div className="flex justify-center my-10">
                  <p className="text-green-600 font-medium text-md">
                    {message}
                  </p>
                </div>
              )}

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
                    type="submit"
                    disabled={success}
                    className={`bg-gray-800  text-white font-bold py-2 px-4 rounded-lg shadow-md ${
                      success
                        ? "hover:cursor-not-allowed"
                        : "hover:bg-highlight"
                    }`}
                  >
                    Save Password
                  </button>
                )}
              </div>
            </form>
            <div className="flex justify-center mb-10">
              <Link to="/login" className="text-blue-500">
                Password reseted successfully Click here to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
