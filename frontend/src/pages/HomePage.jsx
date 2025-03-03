import React, { useEffect, useState, useRef } from "react";
import { BlogCard } from "../components";
import { server } from "../constants.js";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "@mui/material/Pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { setCurrentInterest } from "../features/constants/constantsSlice.js";
import { setQuery } from "../features/constants/constantsSlice.js";

function HomePage() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.auth.user);

  const userLoading = useSelector((state) => state.auth.loading);

  const userInterests = useSelector((state) => state.constants.userInterests);

  const currentInterest = useSelector(
    (state) => state.constants.currentInterest
  );

  const [blogs, setBlogs] = useState([]);

  const interestsRef = useRef(null); // Ref for scrolling

  const query = useSelector((state) => state.constants.query);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios
          .get(`${server}/blog/get-blog-by-category`, {
            params: {
              category: currentInterest,
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
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllBlogs = async () => {
      try {
        setLoading(true);
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
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const searchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios
          .get(`${server}/blog/search-blog`, {
            params: {
              query,
              page,
              limit: 10,
            },
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          })
          .then((res) => res.data);
        setBlogs(response.data.docs);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };

    const searchBlogCategory = async () => {
      try {
        setLoading(true);
        const response = await axios
          .get(`${server}/blog/search-blog-by-category`, {
            params: {
              query,
              category: currentInterest,
              page,
              limit: 10,
            },
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          })
          .then((res) => res.data);
        setBlogs(response.data.docs);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };

    if (query) {
      if (currentInterest === "Latest") {
        searchBlog();
      } else {
        searchBlogCategory();
      }
    } else {
      if (currentInterest !== "Latest") {
        fetchBlogs();
      } else {
        fetchAllBlogs();
      }
    }
    setLoading(false);
  }, [currentInterest, user, page, query]);

  useEffect(() => {
    setPage(1);
  }, [currentInterest, query]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  // Scroll functions
  const scrollLeft = () => {
    if (interestsRef.current) {
      interestsRef.current.scrollLeft -= 100; // Adjust scrolling speed
    }
  };

  const scrollRight = () => {
    if (interestsRef.current) {
      interestsRef.current.scrollLeft += 100;
    }
  };

  const handleInterestClick = (index) => {
    dispatch(setCurrentInterest(userInterests[index]));
    dispatch(setQuery(""));
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      {/* Interests Bar with Scroll Buttons */}
      <div className="relative bg-secondary p-2 flex items-center">
        <button
          onClick={scrollLeft}
          className="absolute left-0 hover:bg-highlight text-white p-2 ml-1 rounded-full z-10"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={interestsRef}
          className="flex overflow-x-auto scrollbar-hide space-x-3 mx-10"
          style={{ scrollBehavior: "smooth" }}
        >
          {userInterests.map((interest, index) => (
            <button
              key={index}
              onClick={() => handleInterestClick(index)}
              className={`text-white p-1 rounded-md hover:bg-highlight transition whitespace-nowrap border-b-2 ${
                currentInterest === interest
                  ? "border-white font-bold rounded-b-none"
                  : "border-transparent"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 hover:bg-highlight text-white p-2 rounded-full z-10 mr-1"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="sm:w-11/12 my-2 p-5 max-w-5xl m-auto gap-4 grid">
          {blogs &&
            blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
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

export default HomePage;
