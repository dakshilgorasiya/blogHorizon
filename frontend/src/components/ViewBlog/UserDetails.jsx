import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Heart,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  Ellipsis,
  Copy,
  TriangleAlert,
} from "lucide-react";
import axios from "axios";
import { server } from "../../constants.js";
import {
  setIsFollowed,
  setIsLiked,
  toggleIsFavorite,
} from "../../features/blog/blogSlice.js";
import { useNavigate, Link } from "react-router-dom";
import { callSecureApi } from "../../utils/callSecureApi.js";
import { Notify, PostComment, BlogComment, Report } from "../../components";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function UserDetails({
  admin = false,
  reportCount = 0,
  setReportCount = () => {},
}) {
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [type, setType] = useState("success");

  const [showComment, setShowComment] = useState(false);

  const [showReport, setShowReport] = useState(false);

  const [comments, setComments] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);

  const MenuOpen = Boolean(anchorEl);

  // Menu
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const dispatch = useDispatch();

  const blogId = useSelector((state) => state.blog.blog._id);

  const owner = useSelector((state) => state.blog.blog.owner);

  const createdAt = useSelector((state) => state.blog.blog.createdAt);

  const likes = useSelector((state) => state.blog.blog.likeCount);

  const commentCount = useSelector((state) => state.blog.blog.commentCount);

  const category = useSelector((state) => state.blog.blog.category);

  const tags = useSelector((state) => state.blog.blog.tags);

  const liked = useSelector((state) => state.blog.blog.isLiked);

  const favorited = useSelector((state) => state.blog.blog.isFavorite);

  const isFollowed = useSelector((state) => state.blog.blog.isFollowed);

  const followersCount = useSelector((state) => state.blog.blog.followersCount);

  const user = useSelector((state) => state.auth.user);

  const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Follow user
  const handleClickOnFollow = async (e) => {
    try {
      const response = await callSecureApi({
        url: `${server}/follow/toggle-follow`,
        method: "POST",
        body: {
          followId: owner._id,
        },
        accessToken: user?.accessToken,
        dispatch,
        setError,
      });

      console.log(response);

      if (response.statusCode === 200) {
        if (isFollowed) {
          dispatch(setIsFollowed(false));
        } else {
          dispatch(setIsFollowed(true));
        }
      }
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  // Like blog
  const handleClickLike = async (e) => {
    try {
      const response = await callSecureApi({
        url: `${server}/like/toggle-like`,
        method: "POST",
        body: {
          type: "blog",
          id: blogId,
        },
        accessToken: user?.accessToken,
        dispatch,
        setError,
      });

      console.log(response);

      if (response.statusCode === 200) {
        dispatch(
          setIsLiked({
            isLiked: response.data.userLiked,
            likeCount: response.data.totalLikes,
          })
        );
      }
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  // Save bookmark
  const handleClickFavorite = async (e) => {
    try {
      const response = await callSecureApi({
        url: `${server}/user/makeBlogFavorite`,
        method: "POST",
        body: {
          blogId,
        },
        accessToken: user?.accessToken,
        dispatch,
        setError,
      });

      console.log(response);

      if (response.statusCode === 200) {
        dispatch(toggleIsFavorite());
      }
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  // Show comment
  const handleShowComment = () => {
    setShowComment(true);
  };

  const handleShowReport = () => {
    setShowReport(true);
  };

  return (
    <>
      <div>
        <SwipeableDrawer
          anchor="bottom"
          open={showComment}
          onClose={() => setShowComment(false)}
          onOpen={() => setShowComment(true)}
          disableSwipeToOpen={false} // Allows swipe from the edge
          PaperProps={{
            sx: { maxHeight: "66vh", borderRadius: "12px 12px 0 0" },
          }} // Limits height and adds rounded corners
        >
          <div className="p-4">
            <PostComment blogId={blogId} setComment={setComments} />
            <BlogComment
              blogId={blogId}
              comments={comments}
              setComments={setComments}
            />
          </div>
        </SwipeableDrawer>
      </div>

      <div>
        <SwipeableDrawer
          anchor="bottom"
          open={showReport}
          onClose={() => setShowReport(false)}
          onOpen={() => setShowReport(true)}
          disableSwipeToOpen={false} // Allows swipe from the edge
          PaperProps={{
            sx: { maxHeight: "66vh", borderRadius: "12px 12px 0 0" },
          }} // Limits height and adds rounded corners
        >
          <div className="p-4">
            <Report />
          </div>
        </SwipeableDrawer>
      </div>

      <Notify message={message} setOpen={setOpen} open={open} type={type} />

      <div className="shadow-lg p-3 border-accent rounded">
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="flex items-center">
            <div className="mr-3">
              <Link to={`/profile/${owner._id}`} className="flex items-center">
                <img src={owner?.avatar} className="rounded-full h-14 w-14" />
              </Link>
            </div>

            <div>
              <div className="mr-2">
                <Link
                  to={`/profile/${owner._id}`}
                  className="flex items-center"
                >
                  <p className="font-semibold">{owner.userName}</p>
                </Link>
              </div>
              <div className="flex">
                <button
                  onClick={handleClickOnFollow}
                  className={`bg-priary hover:bg-highlight text-white font-bold mr-2 py-1 px-2 rounded-full text-xs ${
                    user?._id === owner._id ? "hidden" : "block"
                  }`}
                >
                  {isFollowed ? "Following" : "Follow"}
                </button>
                <p className="text-sm">{followersCount} followers</p>
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
                className="flex items-center justify-center hover:scale-110 transition-transform"
                whileTap={{ scale: 0.9 }}
                onClick={handleClickLike}
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

            <div className="flex items-center mr-5">
              <motion.button
                className="flex items-center justify-center hover:scale-110 transition-transform"
                whileTap={{ scale: 0.9 }}
                onClick={handleShowComment}
              >
                <MessageSquare size={20} className="text-gray-500" />
              </motion.button>
              <p className="ml-1">{commentCount}</p>
            </div>

            {admin && (
              <div className="flex items-center">
                <motion.button
                  className="flex items-center justify-center hover:scale-110 transition-transform"
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShowReport}
                >
                  <TriangleAlert size={20} className="text-red-500" />
                </motion.button>
                <p className="ml-1">{reportCount}</p>
              </div>
            )}
          </div>

          <div className="flex items-center ml-auto">
            <div className="mr-5">
              <motion.button
                className="flex items-center justify-center hover:scale-110 transition-transform"
                whileTap={{ scale: 0.9 }}
                onClick={handleClickFavorite}
              >
                <Bookmark
                  size={20}
                  className={`transition-all duration-300 ${
                    favorited
                      ? "fill-stone-500 text-stone-500"
                      : "text-gray-500"
                  }`}
                />
              </motion.button>
            </div>

            <div className="mr-3 mt-2">
              <button onClick={handleClick}>
                <Ellipsis size={20} />
              </button>
            </div>

            <div>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={MenuOpen}
                onClose={handleClose}
                MenuListProps={{ "aria-labelledby": "basic-button" }}
              >
                <MenuItem onClick={handleClose}>
                  <motion.button
                    onClick={() =>
                      navigator.clipboard.writeText(window.location.href)
                    }
                    className="flex items-center justify-center hover:scale-110 transition-transform"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Copy size={20} className="text-gray-500" />
                    <p className="ml-2"> Copy Link</p>
                  </motion.button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <motion.button
                    onClick={() => {
                      navigate(`/report/${blogId}`);
                    }}
                    className="flex items-center justify-center hover:scale-110 transition-transform"
                    whileTap={{ scale: 0.9 }}
                  >
                    <TriangleAlert size={20} className="text-red-500" />
                    <p className="ml-2">Report Blog</p>
                  </motion.button>
                </MenuItem>
              </Menu>
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
