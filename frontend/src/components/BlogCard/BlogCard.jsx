import { Avatar } from "@mantine/core";
import React from "react";
import { ThumbsUp, MessageSquare, Calendar } from "lucide-react";

function BlogCard() {
  const blog = {
    _id: "67b22349be3526c0beced02a",
    title: "ECMAScript 2025: What’s Actually Coming to JavaScript? 🚀✨",
    owner: {
      _id: "67b1c637927d53d6d076742e",
      userName: "Dakshil Coder",
      avatar:
        "http://res.cloudinary.com/bloghorizon/image/upload/v1739703713/zzytnxeuzpuogj2nxlxc.jpg",
    },
    content: null,
    category: "Personal Development",
    tags: [
      "#personal",
      "#development",
      "#personaldevelopment",
      "#travel",
      "#blog",
      "#blogging",
      "#coding",
      "#programming",
      "#webdevelopment",
      "#webdesign",
    ],
    createdAt: "2025-02-16T17:41:29.609Z",
    followersCount: 1,
    commentCount: 0,
    likeCount: 0,
    thumbnail:
      "http://res.cloudinary.com/bloghorizon/image/upload/v1739727690/vfeinw4et7n5iwz3prob.jpg",
  };

  const formattedBlogCategory = blog.category.replace(/ /g, "").toLowerCase();

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div className="grid grid-cols-12 border rounded-lg border-gray-500 p-4">
        <div className="sm:ml-5 mt-2 col-span-7">
          <div className="flex items-center">
            <div className="mr-3">
              <img
                src={blog.owner.avatar}
                alt=""
                className="rounded-full sm:h-14 sm:w-14 h-10 w-10"
              />
            </div>

            <div>
              <div className="mr-2">
                <p className="font-semibold text-sm md:text-lg">
                  {blog.owner.userName}
                </p>
              </div>
              <div className="flex">
                <p className="sm:text-sm text-xs">
                  {blog.followersCount} followers
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 ml-3">
            <h1 className="sm:text-2xl font-bold">{blog.title}</h1>
          </div>

          <div className="mt-3">
            <div className="flex items-center ml-3">
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-500" />
                <p className="text-sm font-sm ml-1 w-max">{formattedDate}</p>
              </div>

              <div className="flex items-center ml-5 mr-5">
                <ThumbsUp size={18} className="text-gray-500" />
                <p className="ml-1">{blog.likeCount}</p>
              </div>

              <div className="flex items-center">
                <MessageSquare size={18} className="text-gray-500" />
                <p className="ml-1">{blog.commentCount}</p>
              </div>
            </div>
          </div>

          <div className="ml-3 flex flex-wrap max-w-fit min-w-80 pr-2">
            <p className="sm:text-sm text-xs text-gray-500 m-1 mr-2 inline">
              #{formattedBlogCategory}
            </p>
            {blog.tags.map((tag) => (
              <p
                key={tag}
                className="sm:text-sm text-xs text-gray-500 m-1 inline"
              >
                {tag}
              </p>
            ))}
          </div>
        </div>

        <div className="ml-auto col-span-5">
          <img
            src={blog.thumbnail}
            alt="thumbnail"
            className="w-full  rounded-lg lg:h-full"
          />
        </div>
      </div>
    </>
  );
}

export default BlogCard;
