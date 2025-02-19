import React from "react";
import { BlogCard } from "../../components";

function UserBlog({ data }) {
  return (
    <>
      <div className="m-2">
        <div className="gap-4 grid">
          {data.blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} showUserDetails={false}/>
          ))}
        </div>
      </div>
    </>
  );
}

export default UserBlog;
