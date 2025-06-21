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
      {/* Decorative background elements */}
      <div className="relative min-h-screen">
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
        <div className="absolute top-40 right-1/4 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000"></div>

        {/* Header Section */}
        <div className="relative pt-8 pb-6">
          <div className="flex flex-col items-center">
            {/* Icon container with gradient background */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full shadow-xl">
                <Bookmark className="text-white" size={40} />
              </div>
            </div>

            {/* Title with gradient text */}
            <h1 className="font-bold text-4xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Bookmarked
            </h1>
            <p className="text-gray-600 text-lg">
              Your saved articles and stories
            </p>

            {/* Decorative line */}
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4"></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 rounded-2xl shadow-2xl mx-4 lg:mx-8 mb-8 overflow-hidden">
          {/* Glass morphism container */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
            {blogs && blogs.length > 0 ? (
              <>
                {/* Stats header */}
                <div className="mb-8">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-8 h-8 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {blogs.length}
                          </span>
                        </div>
                        <span className="text-gray-700 font-medium">
                          {blogs.length === 1
                            ? "Bookmarked Article"
                            : "Bookmarked Articles"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">Ready to read</div>
                    </div>
                  </div>
                </div>

                {/* Blog Grid */}
                <div className="grid gap-6 grid-cols-2 max-w-7xl mx-auto ">
                  {blogs.map((blog, index) => (
                    <div
                      key={blog._id}
                      className="group animate-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                        {/* Card Enhancement Wrapper */}
                        <div className="relative">
                          {/* Gradient overlay for visual depth */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>

                          {/* Bookmark indicator */}
                          <div className="absolute top-4 right-4 z-10">
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-full shadow-lg">
                              <Bookmark
                                className="text-white fill-white"
                                size={16}
                              />
                            </div>
                          </div>

                          {/* Blog Card Content */}
                          <div className="relative">
                            <BlogCard key={blog._id} blog={blog} />
                          </div>

                          {/* Subtle bottom accent */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full blur opacity-25"></div>
                  <div className="relative bg-gradient-to-r from-gray-200 to-gray-300 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                    <Bookmark className="h-12 w-12 text-gray-400" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-gray-700 mb-4">
                  No bookmarks yet
                </h3>
                <p className="text-gray-500 text-lg max-w-md mx-auto mb-8">
                  Start bookmarking articles you want to read later. They'll
                  appear here for easy access.
                </p>

                {/* Decorative elements */}
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .auto-fit-minmax-350 {
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        }

        @media (max-width: 768px) {
          .auto-fit-minmax-350 {
            grid-template-columns: 1fr;
          }
        }

        @keyframes slide-in-from-bottom-4 {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .slide-in-from-bottom-4 {
          animation-name: slide-in-from-bottom-4;
        }
      `}</style>
    </>
  );
}

export default BookmarkBlog;
