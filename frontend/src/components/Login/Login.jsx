import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../features/auth/authReducers.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const error = useSelector((state) => state.auth.error);

  const loading = useSelector((state) => state.auth.loading);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen p-5 bg-accent">
        <div className="border-2 border-black rounded-lg p-4 shadow-md w-full max-w-md bg-background">
          <h1 className="text-4xl text-center font-extrabold mt-8">Login</h1>

          <div className="mt-20 p-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <label className="text-lg block">Email</label>
                <input
                  type="email"
                  className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>

              <div className="mb-4 box-border">
                <label className="text-lg block">Password</label>
                <input
                  type="password"
                  className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>

              <div className="flex justify-center my-10">
                {error && (
                  <p className="text-red-500 font-medium text-md">{error}</p>
                )}
              </div>

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
                    className="bg-gray-800 hover:bg-highlight text-white font-bold py-2 px-4 rounded-lg shadow-md"
                  >
                    Login
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

export default Login;
