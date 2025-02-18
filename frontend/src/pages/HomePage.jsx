import React from "react";
import { BlogCard } from "../components";

function HomePage() {
  const tempData = [
    {
      _id: "67b22119be3526c0bececfee",
      title: "asd",
      owner: {
        _id: "67b1c637927d53d6d076742e",
        userName: "Dakshil Coder",
        avatar:
          "http://res.cloudinary.com/bloghorizon/image/upload/v1739703713/zzytnxeuzpuogj2nxlxc.jpg",
      },
      category: "Personal Development",
      tags: ["#asdf"],
      createdAt: "2025-02-16T17:32:09.700Z",
      followersCount: 1,
      commentCount: 0,
      likeCount: 0,
    },
    {
      _id: "67b22349be3526c0beced02a",
      title: "asdfsd",
      owner: {
        _id: "67b1c637927d53d6d076742e",
        userName: "Dakshil Coder",
        avatar:
          "http://res.cloudinary.com/bloghorizon/image/upload/v1739703713/zzytnxeuzpuogj2nxlxc.jpg",
      },
      category: "Personal Development",
      tags: ["#asdf", "#adfg"],
      createdAt: "2025-02-16T17:41:29.609Z",
      followersCount: 1,
      commentCount: 0,
      likeCount: 0,
    },
  ];

  return (
    <>
      <div className="sm:w-11/12 my-2 p-5 max-w-5xl m-auto">
        <BlogCard />
      </div>
    </>
  );
}

export default HomePage;
