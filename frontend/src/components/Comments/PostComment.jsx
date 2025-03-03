import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { server } from "../../constants.js";
import useSecureAPI from "../../hooks/useSecureApi.js";
import { SendHorizonal } from "lucide-react";
import { motion } from "framer-motion";
import { setCommentCount } from "../../features/blog/blogSlice.js";

function PostComment({ blogId, setComment }) {
  const dispatch = useDispatch();
  const { callAPI } = useSecureAPI();
  const user = useSelector((state) => state.auth.user);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const commentCount = useSelector((state) => state.blog.blog.commentCount);

  const postComment = async () => {
    try {
      const response = await callAPI({
        url: `${server}/comment/postComment`,
        method: "POST",
        body: {
          blogId: blogId,
          content: content,
        },
        accessToken: user?.accessToken,
        dispatch,
        setError,
      });
      if (response?.success) {
        setContent("");
        dispatch(setCommentCount(commentCount + 1));

        const newComment = {
          _id: response.data._id,
          owner: {
            id: user._id,
            userName: user.userName,
            avatar: user.avatar,
          },
          blog: blogId,
          content: content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
          replies: 0,
          haveReplies: false,
          likes: 0,
          userLiked: false,
        };

        setComment((prev) => [...prev, newComment]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex items-center w-full">
        <img
          src={user?.profilePicture}
          alt="profile"
          className="w-8 h-8 rounded-full mr-2"
        />
        <input
          onChange={(e) => setContent(e.target.value)}
          value={content}
          type="text"
          placeholder="Write a comment..."
          className="p-1 pl-4 rounded-full border border-gray-300 w-full"
        />
        <motion.button
          className="flex items-center justify-center transition-all p-1 rounded-lg hover:bg-stone-200"
          whileTap={{ scale: 0.9 }}
          onClick={postComment}
        >
          <SendHorizonal size={20} className="text-gray-500" />
        </motion.button>
      </div>
    </>
  );
}

export default PostComment;
