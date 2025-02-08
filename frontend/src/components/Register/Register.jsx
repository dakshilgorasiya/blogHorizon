import React, { useState, useId } from "react";
import { useSelector, useDispatch } from "react-redux";
import { register } from "../../features/auth/authReducers.js";

function Register() {
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

  const error = useSelector((state) => state.auth.error);

  const loading = useSelector((state) => state.auth.loading);

  const interests = useSelector((state) => state.constants.interests);

  const dispatch = useDispatch();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    data.delete("confirmPassword");
    dispatch(register(data));
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen p-5 bg-accent">
        <div className="border-2 border-black rounded-lg p-4 shadow-md w-full max-w-md bg-background">
          <h1 className="text-4xl text-center font-extrabold mt-8">Register</h1>

          <div className="mt-20 p-3">
            <form onSubmit={handleSubmit}>
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
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4 box-border">
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
                  onChange={handleChange}
                />
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
                    Register
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

export default Register;
