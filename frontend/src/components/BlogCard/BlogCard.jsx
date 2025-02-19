import { Avatar } from "@mantine/core";
import React from "react";
import { ThumbsUp, MessageSquare, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

function BlogCard({ blog, showUserDetails = true }) {
  const formattedBlogCategory = blog.category.replace(/ /g, "").toLowerCase();

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div className="grid grid-cols-12 border rounded-lg border-gray-500 p-4 shadow-sm shadow-secondary">
        <div className="sm:ml-5 mt-2 col-span-7">
          {showUserDetails && (
            <div className="flex items-center">
              <div className="mr-3">
                <Link to={`/profile/${blog.owner._id}`}>
                  <img
                    src={blog.owner.avatar}
                    alt=""
                    className="rounded-full sm:h-14 sm:w-14 h-10 w-10"
                  />
                </Link>
              </div>

              <div>
                <div className="mr-2">
                  <Link to={`/profile/${blog.owner._id}`}>
                    <p className="font-semibold text-sm md:text-lg">
                      {blog.owner.userName}
                    </p>
                  </Link>
                </div>
                <div className="flex">
                  <p className="sm:text-sm text-xs">
                    {blog.followersCount} followers
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-3 ml-3">
            <Link to={`/view-blog/${blog._id}`} className="hover:underline">
              <h1 className="sm:text-2xl font-bold">{blog.title}</h1>
            </Link>
          </div>

          <div className="mt-3">
            <div className="flex items-center flex-wrap ml-3">
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-500" />
                <p className="text-sm font-sm ml-1 w-max">{formattedDate}</p>
              </div>

              <div className="flex items-center ml-5 mr-5">
                <Link to={`/view-blog/${blog._id}`} className="hover:underline">
                  <ThumbsUp size={18} className="text-gray-500" />
                </Link>
                <p className="ml-1">{blog.likeCount}</p>
              </div>

              <div className="flex items-center">
                <Link to={`/view-blog/${blog._id}`} className="hover:underline">
                  <MessageSquare size={18} className="text-gray-500" />
                </Link>
                <p className="ml-1">{blog.commentCount}</p>
              </div>
            </div>
          </div>

          <div className="ml-3 flex flex-wrap max-w-fit min-w-80 sm:min-w-[30rem] pr-2">
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
          <Link to={`/view-blog/${blog._id}`}>
            <img
              src={blog.thumbnail}
              alt="thumbnail"
              className="w-full rounded-lg lg:h-full"
            />
          </Link>
        </div>
      </div>
    </>
  );
}

export default BlogCard;
