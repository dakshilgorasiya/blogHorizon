import React, { useState } from "react";
import {
  ThumbsUp,
  MessageSquare,
  Calendar,
  TriangleAlert,
  User,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function BlogCard({
  blog,
  showUserDetails = true,
  admin = false,
  reportCount = 0,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formattedBlogCategory = blog.category.replace(/ /g, "").toLowerCase();

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const blogUrl = admin
    ? `/admin/view-blog/${blog._id}`
    : `/view-blog/${blog._id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-purple-200"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Content Section */}
          <div className="flex-1 space-y-4">
            {/* Author Section */}
            {showUserDetails && (
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={`/profile/${blog.owner._id}`}
                  className="flex-shrink-0"
                >
                  <div className="relative">
                    <motion.img
                      src={blog.owner.avatar}
                      alt={`${blog.owner.userName}'s avatar`}
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover ring-3 ring-purple-100 hover:ring-purple-300 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${blog.owner._id}`}>
                    <motion.h3
                      className="font-bold text-gray-900 text-sm lg:text-base hover:text-purple-600 transition-colors duration-200 truncate"
                      whileHover={{ x: 2 }}
                    >
                      {blog.owner.userName}
                    </motion.h3>
                  </Link>
                  <div className="flex items-center space-x-1 mt-1">
                    <User size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-500 font-medium">
                      {blog.followersCount.toLocaleString()} followers
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Title Section */}
            <div className="space-y-2">
              <Link to={blogUrl} className="block">
                <motion.h1
                  className="text-xl lg:text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors duration-300 line-clamp-2 leading-tight"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {blog.title}
                </motion.h1>
              </Link>
            </div>

            {/* Meta Information */}
            <div className="flex items-center flex-wrap gap-4 text-sm">
              {/* Date */}
              <motion.div
                className="flex items-center space-x-2 text-gray-600"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-purple-100 transition-colors duration-300">
                  <Calendar
                    size={14}
                    className="text-gray-600 group-hover:text-purple-600"
                  />
                </div>
                <span className="font-medium">{formattedDate}</span>
              </motion.div>

              {/* Likes */}
              <Link to={blogUrl}>
                <motion.div
                  className="flex items-center space-x-2 hover:text-purple-600 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      blog.isLiked
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-600"
                    }`}
                  >
                    <ThumbsUp
                      size={14}
                      className={blog.isLiked ? "fill-current" : ""}
                    />
                  </div>
                  <span className="font-medium">
                    {blog.likeCount.toLocaleString()}
                  </span>
                </motion.div>
              </Link>

              {/* Comments */}
              <Link to={blogUrl}>
                <motion.div
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="p-1.5 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors duration-300">
                    <MessageSquare size={14} className="hover:text-blue-600" />
                  </div>
                  <span className="font-medium">
                    {blog.commentCount.toLocaleString()}
                  </span>
                </motion.div>
              </Link>

              {/* Admin Reports */}
              {admin && (
                <Link to={blogUrl}>
                  <motion.div
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="p-1.5 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-300">
                      <TriangleAlert size={14} />
                    </div>
                    <span className="font-medium">{blog.reportCount}</span>
                  </motion.div>
                </Link>
              )}
            </div>

            {/* Tags Section */}
            <div className="flex flex-wrap gap-2 pt-2">
              {/* Category Tag */}
              <motion.span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 hover:from-purple-200 hover:to-blue-200 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                #{formattedBlogCategory}
              </motion.span>

              {/* Tags */}
              {blog.tags.slice(0, 3).map((tag, index) => (
                <motion.span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 17,
                    delay: index * 0.05,
                  }}
                >
                  {tag}
                </motion.span>
              ))}

              {blog.tags.length > 3 && (
                <motion.span
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  +{blog.tags.length - 3} more
                </motion.span>
              )}
            </div>
          </div>

          {/* Thumbnail Section */}
          <div className="flex-shrink-0 lg:w-80">
            <Link to={blogUrl} className="block">
              <motion.div
                className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 bg-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-video lg:aspect-[4/3]">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>
                  )}

                  <img
                    src={blog.thumbnail}
                    alt={`${blog.title} thumbnail`}
                    className={`w-fit h-full object-cover transition-all duration-500 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    } hover:scale-110`}
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                  />

                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="flex items-center space-x-2 text-white">
                      <Eye size={16} />
                      <span className="text-sm font-medium">Read Article</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle Border Animation */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-purple-200 group-hover:via-blue-200 group-hover:to-purple-200 transition-all duration-500 pointer-events-none opacity-0 group-hover:opacity-100" />
    </motion.div>
  );
}

export default BlogCard;
