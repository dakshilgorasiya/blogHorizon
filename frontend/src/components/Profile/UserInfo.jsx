import React, { useState, useEffect, useRef } from "react";
import { server } from "../../constants.js";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { callSecureApi } from "../../utils/callSecureApi.js";
import { Notify } from "../../components";
import { Pencil, CircleX } from "lucide-react";
import { setUserBio, setUserAvatar } from "../../features/auth/authSlice.js";
import { Tooltip } from "@mui/material";
import { sendNotification } from "../../features/notification/notificationSlice.js";

function UserInfo({ data, ownerId }) {
  const dispatch = useDispatch();

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
      const response = await callSecureApi({
        url: `${server}/follow/toggle-follow`,
        method: "POST",
        body: {
          followId: data._id,
        },
        accessToken: user?.accessToken,
        dispatch,
        setError,
      });

      console.log(response);

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
      const response = await callSecureApi({
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
      const response = await callSecureApi({
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

      <div className="flex flex-col items-center border border-black shadow-sm shadow-stone-600 rounded-lg m-2 lg:ml-5 p-5">
        <div className="relative">
          {showAvatarSaveBtn ? (
            <>
              <img src={avatarPreview} className="rounded-full w-60 h-60" />
            </>
          ) : (
            <>
              <img src={data.avatar} className="rounded-full w-60 h-60" />
            </>
          )}
          <label className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100">
            {user && user._id === data._id && (
              <Pencil className="h-5 w-5 text-gray-600 hover:fill-gray-300" />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {showAvatarSaveBtn && (
          <div className="mt-3 flex items-center">
            {loading ? (
              <>
                <button
                  className="bg-gray-800 hover:bg-highlight text-white font-bold py-2 px-4 rounded-lg shadow-md"
                  disabled
                >
                  Loading...
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveAvatar}
                  className="bg-gray-800 hover:bg-highlight text-white font-semibold p-1 rounded-lg shadow-md"
                >
                  Save Avatar
                </button>
                <Tooltip title="Cancel" placement="right" arrow>
                  <button onClick={handleCancelAvatar} className="ml-2">
                    <CircleX size={20} />
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        )}

        <div>
          <h1 className="font-extrabold text-2xl mt-5">{data.userName}</h1>
        </div>

        <div className="flex items-center mt-2">
          {showInput ? (
            <>
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg ml-10 lg:ml-0"
                />
              </div>
            </>
          ) : (
            <h1 className="font-bold text-lg">{data.bio}</h1>
          )}
          {user && user._id === data._id && (
            <div className="p-2 ml-2 rounded-full cursor-pointer">
              <button onClick={() => handleClickEditBio()}>
                <Pencil
                  size={18}
                  className="text-gray-600 hover:fill-gray-300"
                />
              </button>
            </div>
          )}
        </div>

        {showInput && (
          <>
            <div className="mt-3">
              <button
                onClick={(e) => handleSaveBio(e)}
                className="bg-gray-800 hover:bg-highlight text-white font-semibold p-1 rounded-lg shadow-md"
              >
                Save Bio
              </button>
            </div>
          </>
        )}

        <div className="mt-3">
          <button
            onClick={handleClickOnFollow}
            className={`bg-priary hover:bg-highlight text-white font-bold mr-2 py-2 px-4 rounded-full text-sm ${
              user?._id === data._id ? "hidden" : "block"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        <div className="mt-5 flex justify-evenly shadow p-2 rounded shadow-gray-600 w-full">
          <div className="flex flex-col items-center">
            <p>Blogs</p>
            <p>{data.blogs.length}</p>
          </div>
          <div className="flex flex-col items-center">
            <p>Followers</p>
            <p>{data.followers}</p>
          </div>
          <div className="flex flex-col items-center">
            <p>Following</p>
            <p>{data.following}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
