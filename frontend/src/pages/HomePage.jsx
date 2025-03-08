import React, { useEffect, useState, useRef, useCallback } from "react";
import { BlogCard } from "../components";
import { server } from "../constants.js";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { setCurrentInterest } from "../features/constants/constantsSlice.js";
import { setQuery } from "../features/constants/constantsSlice.js";

function HomePage() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.auth.user);

  const userLoading = useSelector((state) => state.auth.loading);

  const userInterests = useSelector((state) => state.constants.userInterests);

  const currentInterest = useSelector(
    (state) => state.constants.currentInterest
  );

  const [blogs, setBlogs] = useState([]);

  const interestsRef = useRef(null); // Ref for scrolling

  const observerRef = useRef(null); // Ref for IntersectionObserver

  const query = useSelector((state) => state.constants.query);

  const fetchBlogs = useCallback(async () => {
    console.log(page);
    try {
      setLoading(true);
      const response = await axios
        .get(
          query
            ? currentInterest === "Latest"
              ? `${server}/blog/search-blog`
              : `${server}/blog/search-blog-by-category`
            : currentInterest !== "Latest"
            ? `${server}/blog/get-blog-by-category`
            : `${server}/blog/get-all-blogs`,
          {
            params: { category: currentInterest, query, page, limit: 1 },
            headers: { Authorization: `Bearer ${user?.accessToken}` },
          }
        )
        .then((res) => res.data);
      setBlogs((prev) =>
        page === 1 ? response.data.docs : [...prev, ...response.data.docs]
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentInterest, page, query, user]);

  useEffect(() => {
    fetchBlogs();
    setLoading(false);
  }, [currentInterest, user, page, query]);

  useEffect(() => {
    setPage(1);
  }, [currentInterest, query]);

  const fetchMoreData = () => {
    console.log("CALLED");
    setPage((prev) => prev + 1);
  };

  // Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchMoreData();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loading]);

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

        <div ref={observerRef} className="h-20" />
      </div>
    </>
  );
}

export default HomePage;
