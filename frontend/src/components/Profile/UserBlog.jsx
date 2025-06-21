import React from "react";
import { BlogCard } from "../../components";
import { motion, AnimatePresence } from "framer-motion";

function UserBlog({ data }) {
  return (
    <>
      <div className="flex flex-col items-center pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid gap-6 mb-8">
            <AnimatePresence mode="wait">
              {data.blogs && data.blogs.length > 0 ? (
                data.blogs.map((blog, index) => (
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
        </motion.div>
      </div>
    </>
  );
}

export default UserBlog;
