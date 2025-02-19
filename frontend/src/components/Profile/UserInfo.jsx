import React from "react";
import { useSelector } from "react-redux";

function UserInfo({ data }) {
  const handleClickOnFollow = () => {};

  const user = useSelector((state) => state.auth.user);

  return (
    <>
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
            {data.isFollowed ? "Following" : "Follow"}
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
