import React, { useState, useEffect } from "react";
import { BlogCard } from "../components";
import { server } from "../constants.js";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Bookmark } from "lucide-react";

function BookmarkBlog() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.auth.user);

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios
          .get(`${server}/blog/get-favoriteblogs`, {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          })
          .then((res) => res.data);

        console.log(response);

        setBlogs(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBlogs();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <Bookmark className="mx-auto mt-5 fill-priary text-priary" size={40} />
        <h1 className="font-bold text-2xl">Bookmarked</h1>
      </div>

      <div className="sm:w-11/12 my-2 p-5 max-w-5xl m-auto gap-4 grid">
        {blogs && blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        {blogs?.length === 0 && (
          <h1 className="text-2xl text-center mt-10">No blogs found</h1>
        )}
      </div>
    </>
  );
}

export default BookmarkBlog;
