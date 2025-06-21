import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { server } from "../constants.js";
import { setApiBlog } from "../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";
import {
  Code,
  Image,
  Text,
  Title,
  UserDetails,
  DeleteBlog,
} from "../components";
import { Link, useNavigate } from "react-router-dom";
import useSecureAPI from "../hooks/useSecureApi.js";
import { Pencil, Clock, ArrowLeft, BookOpen, Share2 } from "lucide-react";
import { Tooltip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

function ViewBlogPage() {
  const dispatch = useDispatch();
  const { callAPI } = useSecureAPI();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const blogOwner = useSelector((state) => state.blog.blog.owner);
  const blog = useSelector((state) => state.blog.blog);
  const { id } = useParams();
  const content = useSelector((state) => state.blog.blog.content);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate estimated reading time
  useEffect(() => {
    if (content && content.length > 0) {
      const wordCount = content.reduce((total, item) => {
        if (item.type === "text") {
          return total + item.data.split(" ").length;
        }
        return total;
      }, 0);

      const readTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
      setEstimatedReadTime(readTime);
    }
  }, [content]);

  useEffect(() => {
    async function fetchData(accessToken = user?.accessToken) {
      try {
        setLoading(true);

        const response = await callAPI({
          url: `${server}/blog/get-blog-by-id/${id}`,
          method: "GET",
          accessToken,
          setError,
          dispatch,
        });

        if (response?.success === false) {
          navigate("/error");
          return;
        }

        dispatch(setApiBlog(response.data));
      } catch (error) {
        navigate("/error");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, id]);

  // Enhanced Loading Component
  const LoadingComponent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <motion.div
              className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full mx-auto absolute top-2 left-1/2 transform -translate-x-1/2"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-gray-800">
              Loading Article
            </h3>
            <p className="text-gray-600">
              Preparing your reading experience...
            </p>
          </motion.div>
          <motion.div
            className="flex space-x-1 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center p-8 bg-white rounded-2xl shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 ">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 z-50 shadow-lg"
        style={{ width: `${readingProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${readingProgress}%` }}
        transition={{ ease: "easeOut" }}
      />

      {/* Back Navigation */}
      <motion.div
        className="fixed top-20 left-6 z-40"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 border border-gray-200"
        >
          <ArrowLeft size={18} className="text-gray-700" />
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            Back
          </span>
        </button>
      </motion.div>

      {/* Main Content Container */}
      <div className="relative">
        {/* Header Section */}
        <motion.div
          className="max-w-4xl mx-auto pt-24 px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <Title />

              {/* Reading Stats */}
              <motion.div
                className="flex items-center space-x-6 mt-4 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-purple-500" />
                  <span>{estimatedReadTime} min read</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen size={16} className="text-blue-500" />
                  <span>{content?.length || 0} sections</span>
                </div>
                {blog.createdAt && (
                  <div className="text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Action Buttons */}
            {user && user._id === blogOwner._id && (
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link to={`/edit-blog/${id}`}>
                  <Tooltip title="Edit Article" arrow placement="top">
                    <motion.button
                      className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Pencil size={18} />
                    </motion.button>
                  </Tooltip>
                </Link>

                <DeleteBlog id={id} />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Hero Image */}
        {content && content[0] && (
          <motion.div
            className="max-w-5xl mx-auto px-6 mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image imageLink={content[0].data} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        )}

        {/* Author Details */}
        <motion.div
          className="max-w-4xl mx-auto px-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-200">
            <UserDetails />
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          className="max-w-4xl mx-auto px-6 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg border border-gray-200">
            <AnimatePresence>
              {content &&
                content.map(
                  (item, index) =>
                    index !== 0 && (
                      <motion.div
                        key={index}
                        className="mb-8 last:mb-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.1 * index,
                          ease: "easeOut",
                        }}
                      >
                        {item.type === "text" && (
                          <div className="prose prose-lg max-w-none">
                            <Text text={item.data} />
                          </div>
                        )}
                        {item.type === "code" && (
                          <div className="rounded-xl overflow-hidden shadow-md">
                            <Code data={item.data} />
                          </div>
                        )}
                        {item.type === "image" && (
                          <div className="rounded-xl overflow-hidden shadow-lg">
                            <Image imageLink={item.data} />
                          </div>
                        )}
                      </motion.div>
                    )
                )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Floating Action Buttons */}
        <motion.div
          className="fixed bottom-8 right-8 flex flex-col space-y-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <Tooltip title="Share Article" placement="left">
            <motion.button
              className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: blog.title,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 size={20} />
            </motion.button>
          </Tooltip>

          <Tooltip title="Scroll to Top" placement="left">
            <motion.button
              className="p-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ArrowLeft size={20} className="rotate-90" />
            </motion.button>
          </Tooltip>
        </motion.div>
      </div>
    </div>
  );
}

export default ViewBlogPage;
