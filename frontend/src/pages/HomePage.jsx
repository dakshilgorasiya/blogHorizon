import React, { useEffect, useState } from "react";
import { BlogCard } from "../components";
import { server } from "../constants.js";
import axios from "axios";
import { useSelector } from "react-redux";

function HomePage() {
  const [response, setResponse] = useState();

  const [blogs, setBlogs] = useState([]);

  const user = useSelector((state) => state.auth.user);

  const userLoading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios
          .get(`${server}/blog/get-all-blogs`, {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          })
          .then((res) => res.data);
        setBlogs(response.data.docs);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    if (!userLoading) fetchData();
  }, [userLoading, user]);

  return (
    <>
      <div className="sm:w-11/12 my-2 p-5 max-w-5xl m-auto gap-4 grid">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </>
  );
}

export default HomePage;
