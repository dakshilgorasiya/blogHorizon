import React, { useEffect, useState } from "react";
import { BlogCard } from "../components";
import { server } from "../constants.js";
import axios from "axios";
import { useSelector } from "react-redux";
import Pagination from "@mui/material/Pagination";

function HomePage() {
  const [blogs, setBlogs] = useState([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.auth.user);

  const userLoading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios
          .get(`${server}/blog/get-all-blogs`, {
            params: {
              page,
              limit: 5,
            },
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          })
          .then((res) => res.data);
        setBlogs(response.data.docs);
        setTotalPages(response.data.totalPages);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    if (!userLoading) fetchData();
    setLoading(false);
  }, [userLoading, user, page]);

  const handleChange = (event, value) => {
    console.log(value);
    setPage(value);
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="sm:w-11/12 my-2 p-5 max-w-5xl m-auto gap-4 grid">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>

        <div className="sm:w-11/12 my-2 p-5 max-w-5xl flex justify-center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChange}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#252422",
              },
              "& .MuiPaginationItem-page.Mui-selected": {
                backgroundColor: "#eb5e28", // red-500 hex code
                color: "white",
              },
              "& .MuiPaginationItem-page.Mui-selected:hover": {
                backgroundColor: "#403d39", // darker red on hover
              },
            }}
          />
        </div>
      </div>
    </>
  );
}

export default HomePage;
