import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Heart, ThumbsUp, MessageSquare, Share2 } from "lucide-react";

function UserDetails() {
  const owner = useSelector((state) => state.blog.blog.owner);

  const createdAt = useSelector((state) => state.blog.blog.createdAt);

  const likes = useSelector((state) => state.blog.blog.likeCount);

  const comments = useSelector((state) => state.blog.blog.commentCount);

  const category = useSelector((state) => state.blog.blog.category);

  const tags = useSelector((state) => state.blog.blog.tags);

  const [liked, setLiked] = useState(false);

  const [favorited, setFavorited] = useState(false);

  const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div className="shadow-lg p-3 border-accent rounded">
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="flex items-center">
            <div className="mr-3">
              <img src={owner?.avatar} className="rounded-full h-14 w-14" />
            </div>

            <div>
              <div className="mr-2">
                <p className="font-semibold">{owner.userName}</p>
              </div>
              <div>
                <button className="bg-priary hover:bg-highlight text-white font-bold py-1 px-2 rounded-full text-xs">
                  Follow
                </button>
              </div>
            </div>
          </div>

          <div className="justify-self-end mt-auto">
            <div className="text-right flex items-center">
              <p className="text-sm font-medium">
                Created at : {formattedDate}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center mt-5">
          <div className="flex items-center ml-3">
            <div className="flex items-center mr-5">
              <motion.button
                onClick={() => setLiked(!liked)}
                className="flex items-center justify-center hover:scale-110 transition-transform"
                whileTap={{ scale: 0.9 }}
              >
                <ThumbsUp
                  size={20}
                  className={`transition-all duration-300 ${
                    liked ? "fill-priary text-secondary" : "text-gray-500"
                  }`}
                />
              </motion.button>
              <p className="ml-1">{likes}</p>
            </div>

            <div className="flex items-center">
              <motion.button
                className="flex items-center justify-center hover:scale-110 transition-transform"
                whileTap={{ scale: 0.9 }}
              >
                <MessageSquare size={20} className="text-gray-500" />
              </motion.button>
              <p className="ml-1">{comments}</p>
            </div>
          </div>

          <div className="flex items-center ml-auto">
            <div className="mr-5">
              <motion.button
                onClick={() => setFavorited(!favorited)}
                className="flex items-center justify-center hover:scale-110 transition-transform"
                whileTap={{ scale: 0.9 }}
              >
                <Heart
                  size={20}
                  className={`transition-all duration-300 ${
                    favorited ? "fill-red-500 text-red-500" : "text-gray-500"
                  }`}
                />
              </motion.button>
            </div>

            <div className="flex items-center mr-3">
              <motion.button
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
                className="flex items-center justify-center hover:scale-110 transition-transform"
                whileTap={{ scale: 0.9 }}
              >
                <Share2 size={20} className="text-gray-500" />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="flex mt-2">
          <div>
            <p className="mx-1">#{category}</p>
          </div>
          <div className="flex">
            {tags.map((tag, index) => (
              <p key={index} className="mx-1">
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
