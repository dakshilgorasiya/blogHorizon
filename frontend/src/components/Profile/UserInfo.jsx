import React, { useState, useEffect, useRef } from "react";
import { server } from "../../constants.js";
import { useSelector, useDispatch } from "react-redux";
import useSecureAPI from "../../hooks/useSecureApi.js";
import { Notify } from "../../components";
import { Pencil, CircleX, Camera, Check, X } from "lucide-react";
import { setUserBio, setUserAvatar } from "../../features/auth/authSlice.js";
import { Tooltip } from "@mui/material";
import { sendNotification } from "../../features/notification/notificationSlice.js";

function UserInfo({ data, ownerId }) {
  const dispatch = useDispatch();

  const { callAPI } = useSecureAPI();

  const inputRef = useRef(null);

  const user = useSelector((state) => state.auth.user);

  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isFollowing, setIsFollowing] = useState(data.isFollowing);

  const [showInput, setShowInput] = useState(false);

  const [bio, setBio] = useState(data.bio);

  const [showAvatarSaveBtn, setShowAvatarSaveBtn] = useState(false);

  const [avatar, setAvatar] = useState(data.avatar);

  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  useEffect(() => {
    setIsFollowing(data.isFollowing);
  }, [data]);

  const handleClickOnFollow = async (e) => {
    try {
      const response = await callAPI({
        url: `${server}/follow/toggle-follow`,
        method: "POST",
        body: {
          followId: data._id,
        },
        accessToken: user?.accessToken,
        dispatch,
        setError,
      });
      if (response?.success) {
        setOpen(true);
        setIsFollowing((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvatarChange = async (e) => {
    setShowAvatarSaveBtn(true);
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleClickEditBio = () => {
    setShowInput((prev) => !prev);
    setBio(data.bio);
  };

  const handleSaveBio = async () => {
    try {
      const response = await callAPI({
        url: `${server}/user/update-bio`,
        method: "POST",
        body: {
          bio,
        },
        accessToken: user?.accessToken,
        dispatch,
        setError,
      });

      if (response?.success) {
        setShowInput(false);
        dispatch(
          sendNotification({
            type: "success",
            message: "Bio updated successfully",
          })
        );
        dispatch(setUserBio(bio));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    setShowAvatarSaveBtn(false);
  };

  const handleSaveAvatar = async () => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      setLoading(true);
      const response = await callAPI({
        url: `${server}/user/update-avatar`,
        method: "PATCH",
        body: formData,
        accessToken: user?.accessToken,
        dispatch,
        setError,
      });

      if (response?.success) {
        dispatch(setUserAvatar(response.data.avatar));
        setShowAvatarSaveBtn(false);
        setAvatar(null);
        setAvatarPreview(null);
        dispatch(
          sendNotification({
            type: "success",
            message: "Avatar updated successfully",
          })
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Notify
          message={`${
            isFollowing ? "Followed successfully" : "Unfollowed successfully"
          }`}
          setOpen={setOpen}
          open={open}
          type="success"
        />
      </div>

      {/* Decorative background elements */}
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>

        <div className="relative bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 rounded-2xl shadow-2xl m-2 lg:ml-5 overflow-hidden">
          {/* Glass morphism container */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative">
                  {showAvatarSaveBtn ? (
                    <img
                      src={avatarPreview}
                      className="rounded-full w-40 h-40 object-cover border-4 border-white shadow-xl transition-transform duration-300 hover:scale-105"
                      alt="Avatar preview"
                    />
                  ) : (
                    <img
                      src={data.avatar}
                      className="rounded-full w-40 h-40 object-cover border-4 border-white shadow-xl transition-transform duration-300 hover:scale-105"
                      alt="User avatar"
                    />
                  )}

                  {user && user._id === data._id && (
                    <label className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 group">
                      <Camera className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Avatar Save/Cancel Buttons */}
              {showAvatarSaveBtn && (
                <div className="mt-6 flex items-center space-x-3 animate-in slide-in-from-top-2 duration-300">
                  {loading ? (
                    <button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg opacity-75 cursor-not-allowed flex items-center space-x-2"
                      disabled
                    >
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSaveAvatar}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center space-x-2"
                      >
                        <Check size={16} />
                        <span>Save Avatar</span>
                      </button>
                      <button
                        onClick={handleCancelAvatar}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Username */}
              <h1 className="font-bold text-3xl mt-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {data.userName}
              </h1>

              {/* Bio Section */}
              <div className="flex items-center mt-4 w-full justify-center">
                {showInput ? (
                  <div className="flex items-center space-x-3 w-full max-w-md animate-in slide-in-from-top-2 duration-300">
                    <input
                      ref={inputRef}
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="flex-1 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg px-4 py-2 bg-white/50 backdrop-blur-sm transition-all duration-300 outline-none"
                      placeholder="Enter your bio..."
                    />
                    <button
                      onClick={handleSaveBio}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setShowInput(false)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 group">
                    <p className="text-gray-700 text-lg font-medium text-center">
                      {data.bio || "No bio available"}
                    </p>
                    {user && user._id === data._id && (
                      <button
                        onClick={handleClickEditBio}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-purple-100 transition-all duration-300"
                      >
                        <Pencil size={16} className="text-purple-600" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Follow Button */}
              <div className="mt-6">
                <button
                  onClick={handleClickOnFollow}
                  className={`${
                    isFollowing
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  } text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    user?._id === data._id ? "hidden" : "block"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>

              {/* Stats Section */}
              <div className="mt-8 w-full">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center group cursor-pointer">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">
                          {data.blogs.length}
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium">Blogs</p>
                    </div>
                    <div className="text-center group cursor-pointer">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">
                          {data.followers}
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium">Followers</p>
                    </div>
                    <div className="text-center group cursor-pointer">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">
                          {data.following}
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium">Following</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
