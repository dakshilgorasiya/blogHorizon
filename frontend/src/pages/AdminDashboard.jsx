import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { server } from "../constants.js";
import Pagination from "@mui/material/Pagination";
import { BlogCard } from "../components";
import useSecureAPi from "../hooks/useSecureApi.js";

function AdminDashboard() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { callAPI } = useSecureAPi();

  const user = useSelector((state) => state.auth.user);

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

  const [adminVerified, setAdminVerified] = useState(false);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(0);

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await callAPI({
          url: `${server}/admin/verify-admin`,
          method: "GET",
          setError,
        });

        if (response?.success) {
          setAdminVerified(true);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      verifyAdmin();
    }
  }, [user]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await callAPI({
          url: `${server}/admin/get-all-reported-blogs`,
          method: "POST",
          body: {
            page,
            limit: 10,
          },
          setError,
          accessToken: user?.accessToken,
          dispatch,
        });
        if (response?.success) {
          setBlogs(response.data.docs);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (adminVerified) {
      fetchBlogs();
    }
  }, [user, page, adminVerified]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="sm:w-11/12 my-2 p-5 max-w-5xl m-auto gap-4 grid">
          {blogs &&
            blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                admin={true}
                reportCount={blog.reportCount}
              />
            ))}
          {blogs?.length === 0 && (
            <h1 className="text-2xl text-center mt-10">No blogs found</h1>
          )}
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

export default AdminDashboard;
