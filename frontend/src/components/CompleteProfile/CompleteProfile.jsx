import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getInterests } from "../../features/constants/constantsReducers.js";
import axios from "axios";
import { server } from "../../constants.js";
import { setUser } from "../../features/auth/authSlice.js";

function CompleteProfile() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    bio: "",
    interests: [],
  });

  const [passwordFormat, setPasswordFormat] = useState({
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    hasLength: false,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

  const interests = useSelector((state) => state.constants.interests);

  const interestsLoading = useSelector((state) => state.constants.loading);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user && user.profileCompleted) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (interests.length === 0 && !interestsLoading) {
      dispatch(getInterests());
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.password == "" ||
      formData.confirmPassword == "" ||
      formData.bio == ""
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

    // TODO call api to complete profile
    setLoading(true);

    try {
      const response = await axios
        .post(`${server}/user/profile-complete`, formData, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        .then((res) => res.data);
      console.log(response);
      setLoading(false);
      dispatch(
        setUser({
          ...response.data,
          accessToken: user.accessToken,
        })
      );
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
            Complete your profile
          </h1>

          <div className="mt-20 p-3">
            <form>
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

              {error && (
                <div className="flex justify-center mt-10">
                  <p className="text-red-500 font-medium text-md">{error}</p>
                </div>
              )}

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
                    onClick={(e) => handleSubmit(e)}
                    className="bg-gray-800 hover:bg-highlight text-white font-bold py-2 px-4 rounded-lg shadow-md"
                  >
                    Save Profile
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

export default CompleteProfile;
