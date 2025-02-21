import React, { useState, useEffect } from "react";
import { server } from "../../constants.js";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { callSecureApi } from "../../utils/callSecureApi.js";
import { Notify } from "../../components";

function UserInfo({ data }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);

  const [isFollowing, setIsFollowing] = useState(data.isFollowing);

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
        <div>
          <img src={data.avatar} className="rounded-full w-60 h-60" />
        </div>

        <div>
          <h1 className="font-extrabold text-2xl mt-5">{data.userName}</h1>
        </div>

        <div>
          <h1 className="font-bold text-lg mt-2">{data.bio}</h1>
        </div>

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
