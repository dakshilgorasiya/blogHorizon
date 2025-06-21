import React, { useEffect, useState, useRef } from "react";
import { BlogCard } from "../components";
import { server } from "../constants.js";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  CircleChevronUp,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { setCurrentInterest } from "../features/constants/constantsSlice.js";
import { setQuery } from "../features/constants/constantsSlice.js";

function HomePage() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const userInterests = useSelector((state) => state.constants.userInterests);
  const currentInterest = useSelector(
    (state) => state.constants.currentInterest
  );
  const query = useSelector((state) => state.constants.query);

  const [blogs, setBlogs] = useState([]);
  const interestsRef = useRef(null);
  const observerRef = useRef(null);

  const fetchBlogs = async () => {
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
            params: { category: currentInterest, query, page, limit: 5 },
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
  };

  useEffect(() => {
    fetchBlogs();
    setLoading(false);
  }, [currentInterest, page, query]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [currentInterest, query]);

  const fetchMoreData = () => {
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

  // Scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    if (interestsRef.current) {
      interestsRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (interestsRef.current) {
      interestsRef.current.scrollLeft += 200;
    }
  };

  const handleInterestClick = (index) => {
    dispatch(setCurrentInterest(userInterests[index]));
    dispatch(setQuery(""));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Loader2 size={48} className="text-purple-600" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            Loading Amazing Content...
          </motion.h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Enhanced Interests Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-30 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-md border-b border-purple-500/20 shadow-2xl"
      >
        <div className="relative p-4 flex items-center max-w-7xl mx-auto">
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(147, 51, 234, 0.2)",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollLeft}
            className="absolute left-4 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-purple-500/20 transition-all duration-200 shadow-lg border border-white/20"
          >
            <ChevronLeft size={20} />
          </motion.button>

          <div
            ref={interestsRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 mx-16 px-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {userInterests.map((interest, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInterestClick(index)}
                className={`
                  relative px-6 py-3 rounded-xl font-semibold whitespace-nowrap
                  transition-all duration-300 border-2 backdrop-blur-sm
                  ${
                    currentInterest === interest
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-400 shadow-lg shadow-purple-500/25"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-purple-400/50"
                  }
                `}
              >
                {interest}
                {currentInterest === interest && (
                  <motion.div
                    layoutId="activeInterest"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(147, 51, 234, 0.2)",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollRight}
            className="absolute right-4 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-purple-500/20 transition-all duration-200 shadow-lg border border-white/20"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col items-center pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid gap-6 mb-8">
            <AnimatePresence mode="wait">
              {blogs && blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <BlogCard blog={blog} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-purple-100">
                    <div className="text-8xl mb-6">📚</div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                      No blogs found
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Try adjusting your search or explore different categories
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Loading indicator for infinite scroll */}
          {loading && page > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-8"
            >
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-purple-100">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 size={20} className="text-purple-600" />
                </motion.div>
                <span className="text-gray-700 font-medium">
                  Loading more...
                </span>
              </div>
            </motion.div>
          )}

          <div ref={observerRef} className="h-20 w-full" />
        </motion.div>
      </div>

      {/* Enhanced Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm transition-all duration-300"
            >
              <CircleChevronUp size={24} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HomePage;
