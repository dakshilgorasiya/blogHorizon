import React, { useEffect, useState } from "react";
import { server } from "../../constants.js";
import axios from "axios";
import { timeAgo } from "../../utils/timeAgo.js";
import { ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, SendHorizonal } from "lucide-react";
import { Reply } from "../../components";
import { callSecureApi } from "../../utils/callSecureApi.js";
import { useSelector, useDispatch } from "react-redux";
import { Notify } from "../../components";

function BlogComment({ blogId, comments, setComments }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);

  const [showReply, setShowReply] = useState([]);

  const [liked, setLiked] = useState([]);

  const [likeCount, setLikeCount] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showReplyBox, setShowReplyBox] = useState(null);

  const [reply, setReply] = useState("");

  const postReply = async (e, index) => {
    e.preventDefault();

    const response = await callSecureApi({
      url: `${server}/comment/postComment`,
      method: "POST",
      body: {
        commentId: comments[index]._id,
        content: reply,
      },
      accessToken: user?.accessToken,
      dispatch,
      setError,
    });

    if (response?.success) {
      setComments((prev) => {
        let temp = [...prev];
        temp[index].replies = temp[index].replies + 1;
        temp[index].haveReplies = true;
        return temp;
      });
      setShowReply((prev) => {
        let temp = [...prev];
        temp[index] = true;
        return temp;
      });
    }

    setShowReplyBox(null);
    setReply("");
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios
          .get(`${server}/comment/getAllComments`, {
            params: { blogId: blogId },
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          })
          .then((res) => res.data);

        console.log(response.data);
        setComments(response.data);
        setShowReply(response.data.map(() => false));
        setLiked(response.data.map((comment) => comment.userLiked));
        setLikeCount(response.data.map((comment) => comment.likes));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [user]);

  const handleClickLike = async (index) => {
    const response = await callSecureApi({
      url: `${server}/like/toggle-like`,
      method: "POST",
      body: {
        type: "comment",
        id: comments[index]._id,
      },
      accessToken: user?.accessToken,
      dispatch,
      setError,
    });
    console.log(response);
    if (response?.success) {
      setLiked((prev) => {
        let temp = [...prev];
        temp[index] = response.data.userLiked;
        return temp;
      });
      setLikeCount((prev) => {
        let temp = [...prev];
        temp[index] = response.data.totalLikes;
        return temp;
      });
    }
  };

  const handleShowReply = (index) => {
    setShowReply((prev) => {
      let temp = [...prev];
      temp[index] = !temp[index];
      return temp;
    });
  };

  const handleReplyClick = async (e, index) => {
    e.preventDefault();
    if (showReplyBox === index) {
      setShowReplyBox(null);
      return;
    }
    setShowReplyBox(index);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Notify
        message={"Comment posting failed"}
        setOpen={setOpen}
        open={open}
        type={"error"}
      />
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div key={comment?._id} className="p-4">
            <div className="flex items-center">
              <div className="mr-2">
                <Link to={`/profile/${comment?.owner?._id}`}>
                  <img
                    src={comment?.owner?.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                </Link>
              </div>
              <div>
                <Link
                  to={`/profile/${comment?.owner?._id}`}
                  className="hover:underline"
                >
                  <div className="font-semibold text-gray-800">
                    {comment?.owner?.userName}
                  </div>
                </Link>
                <div className="text-xs text-gray-500">
                  {timeAgo(comment?.createdAt)}
                </div>
              </div>
            </div>

            <div className="mt-2 text-gray-700">{comment?.content}</div>

            <div className="mt-2 flex items-center">
              <motion.button
                className="flex items-center justify-center rounded-full transition-all"
                whileTap={{ scale: 0.9 }}
                onClick={() => handleClickLike(index)}
              >
                <ThumbsUp
                  size={20}
                  className={`text-gray-500 hover:fill-gray-400 transition-all duration-300 ${
                    liked[index] && "fill-priary text-secondary"
                  }`}
                />
              </motion.button>

              <p className="text-sm text-gray-600 ml-1">{likeCount[index] || 0}</p>

              <div className="ml-2">
                <button
                  onClick={(e) => {
                    handleReplyClick(e, index);
                  }}
                  className="text-sm text-gray-500 ml-2 hover:underline"
                >
                  Reply
                </button>
              </div>

              {comment?.haveReplies && (
                <div>
                  <button
                    onClick={() => handleShowReply(index)}
                    className="flex items-center hover:rounded-full hover:shadow hover:bg-stone-200 hover:shadow-gray-300 p-1 px-3 ml-2 cursor-pointer"
                  >
                    <motion.div
                      initial={false}
                      animate={{ rotate: showReply[index] ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={20} className="text-gray-500" />
                    </motion.div>
                    <p className="text-sm ml-1">
                      {showReply[index] ? "Hide" : "View"} {comment.replies}{" "}
                      replies
                    </p>
                  </button>
                </div>
              )}
            </div>

            {showReplyBox === index && (
              <div>
                <div className="flex ml-12 items-center mt-5">
                  <div>
                    <img
                      src={user?.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div className="ml-2">
                    <input
                      onChange={(e) => setReply(e.target.value)}
                      value={reply}
                      type="text"
                      placeholder="Write a reply..."
                      className="w-80 p-1 pl-4 rounded-full border border-gray-300"
                    />
                  </div>
                  <div className="ml-3">
                    <motion.button
                      className="flex items-center justify-center transition-all p-1 rounded-lg hover:bg-stone-200"
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => postReply(e, index)}
                    >
                      <SendHorizonal size={20} className="text-gray-500" />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            <div className="ml-8 mt-2">
              <AnimatePresence>
                {showReply[index] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Reply commentId={comment?._id} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default BlogComment;
