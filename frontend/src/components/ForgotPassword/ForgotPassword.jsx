import React, { useState } from "react";
import axios from "axios";
import { server } from "../../constants.js";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${server}/user/forgot-password`, {
        email,
      });

      if (response?.data?.success) {
        setMessage(response?.data?.message);
        setLoading(false);
        setSuccess(true);
      } else {
        setError(response?.message);
        setLoading(false);
      }
    } catch (err) {
      setError(err?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen p-5">
        <div className="border-2 border-black rounded-lg p-4 shadow-md w-full max-w-md">
          <h1 className="text-4xl text-center font-extrabold mt-8">
            Forgot Password
          </h1>

          <div className="mt-20 p-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <label className="text-lg inline-block" htmlFor="email">
                  Please enter your email
                </label>
                <input
                  id="email"
                  type="email"
                  disabled={success}
                  className={`border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2 ${
                    success ? "hover:cursor-not-allowed" : ""
                  }`}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
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
                    className={`bg-gray-800 text-white font-bold py-2 px-4 rounded-lg shadow-md ${success ? "hover:cursor-not-allowed" : "hover:bg-highlight"}`}
                  >
                    Send Email
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
