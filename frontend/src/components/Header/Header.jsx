import React, { useState, useEffect } from "react";
import { Search, CircleUser, LogOut, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authReducers.js";
import {
  getInterests,
  getUserInterests,
} from "../../features/constants/constantsReducers.js";
import { CirclePlus, LockKeyhole } from "lucide-react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { Divider } from "@mui/material";
import { Notify } from "../../components";
import { setOpen } from "../../features/notification/notificationSlice.js";
import { setQuery } from "../../features/constants/constantsSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { sendNotification } from "../../features/notification/notificationSlice.js";
import useToken from "../../hooks/useToken.js";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { renewAccessToken } = useToken();

  const user = useSelector((state) => state.auth.user);
  const userInterests = useSelector((state) => state.constants.userInterests);

  const currentInterest = useSelector(
    (state) => state.constants.currentInterest
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    dispatch(getInterests());

    if (user === null) renewAccessToken();
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      dispatch(
        getUserInterests({
          dispatch,
          setError: setErrorMessage,
          accessToken: user.accessToken,
        })
      );
    }
  }, [user, dispatch]);

  const query = useSelector((state) => state.constants.query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const message = useSelector((state) => state.notification.message);

  const setNotificationOpen = () => {
    dispatch(setOpen());
  };

  const notificationOpen = useSelector((state) => state.notification.open);

  const notificationType = useSelector((state) => state.notification.type);

  const handleSearch = () => {
    dispatch(setQuery(searchInput));
    navigate(`/`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Notify
        message={message}
        setOpen={setNotificationOpen}
        open={notificationOpen}
        type={notificationType}
      />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl border-b border-purple-500/20 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo Section */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/" className="block">
                <img
                  src="https://res.cloudinary.com/bloghorizon/image/upload/v1740303181/wbiauijuf8e4gfz5m5xp.png"
                  alt="BlogHorizon"
                  className="h-8 md:h-12 lg:h-14 w-auto filter drop-shadow-lg"
                />
              </Link>
            </motion.div>

            {/* Search Section */}
            <div className="flex-1 max-w-2xl mx-8">
              <motion.div
                className={`relative transition-all duration-300 ${
                  isSearchFocused ? "transform scale-105" : ""
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`
                  bg-white/95 backdrop-blur-sm flex items-center rounded-2xl 
                  transition-all duration-300 shadow-lg hover:shadow-xl
                  ${
                    isSearchFocused
                      ? "ring-4 ring-purple-400/50 shadow-purple-500/25"
                      : "hover:bg-white"
                  }
                `}
                >
                  <input
                    type="text"
                    placeholder="Search articles, topics, authors..."
                    className="flex-1 px-6 py-3 bg-transparent rounded-2xl focus:outline-none text-gray-800 placeholder-gray-500 font-medium"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onKeyPress={handleKeyPress}
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={handleSearch}
                    className="mr-2 p-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
                  >
                    <Search size={20} />
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* User Actions Section */}
            <div className="flex items-center space-x-4">
              {!user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={() => navigate("/login")}
                >
                  <CircleUser size={20} />
                  <span className="hidden sm:block">Sign In</span>
                </motion.button>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Create Blog Button */}
                  <Link to="/create-blog">
                    <Tooltip title="Create New Blog" placement="bottom" arrow>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                        className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <CirclePlus size={20} className="text-white" />
                      </motion.div>
                    </Tooltip>
                  </Link>

                  {/* User Avatar */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                    onClick={handleClick}
                  >
                    <div className="p-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-cover bg-white border-2 border-white"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </motion.button>

                  {/* Enhanced Menu */}
                  <Menu
                    id="user-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{ "aria-labelledby": "user-menu-button" }}
                    PaperProps={{
                      elevation: 24,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        minWidth: 280,
                        borderRadius: "16px",
                        bgcolor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "rgba(255, 255, 255, 0.95)",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                          <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="h-12 w-12 rounded-full object-cover bg-white border-2 border-white"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 truncate">
                            {user.userName}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link to={`/profile/${user._id}`}>
                        <MenuItem
                          onClick={handleClose}
                          sx={{
                            px: 3,
                            py: 1.5,
                            "&:hover": {
                              bgcolor: "rgba(147, 51, 234, 0.1)",
                              transform: "translateX(4px)",
                              transition: "all 0.2s ease",
                            },
                          }}
                        >
                          <div className="flex items-center w-full">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                              <CircleUser size={18} className="text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-700">
                              My Profile
                            </span>
                          </div>
                        </MenuItem>
                      </Link>

                      <Link to={`/bookmark`}>
                        <MenuItem
                          onClick={handleClose}
                          sx={{
                            px: 3,
                            py: 1.5,
                            "&:hover": {
                              bgcolor: "rgba(147, 51, 234, 0.1)",
                              transform: "translateX(4px)",
                              transition: "all 0.2s ease",
                            },
                          }}
                        >
                          <div className="flex items-center w-full">
                            <div className="p-2 bg-amber-100 rounded-lg mr-3">
                              <Bookmark size={18} className="text-amber-600" />
                            </div>
                            <span className="font-medium text-gray-700">
                              My Bookmarks
                            </span>
                          </div>
                        </MenuItem>
                      </Link>

                      {user && user.role === "admin" && (
                        <Link to={`/admin/dashboard`}>
                          <MenuItem
                            onClick={handleClose}
                            sx={{
                              px: 3,
                              py: 1.5,
                              "&:hover": {
                                bgcolor: "rgba(147, 51, 234, 0.1)",
                                transform: "translateX(4px)",
                                transition: "all 0.2s ease",
                              },
                            }}
                          >
                            <div className="flex items-center w-full">
                              <div className="p-2 bg-green-100 rounded-lg mr-3">
                                <LockKeyhole
                                  size={18}
                                  className="text-green-600"
                                />
                              </div>
                              <span className="font-medium text-gray-700">
                                Admin Dashboard
                              </span>
                            </div>
                          </MenuItem>
                        </Link>
                      )}
                    </div>

                    <Divider sx={{ mx: 2, my: 1 }} />

                    {/* Logout Button */}
                    <div className="px-2 pb-2">
                      <button
                        onClick={() => {
                          dispatch(logout());
                          navigate("/");
                          dispatch(
                            sendNotification({
                              message: "Logged out successfully",
                              type: "success",
                            })
                          );
                          handleClose();
                        }}
                        className="w-full"
                      >
                        <MenuItem
                          sx={{
                            px: 3,
                            py: 1.5,
                            borderRadius: "12px",
                            mx: 1,
                            "&:hover": {
                              bgcolor: "rgba(239, 68, 68, 0.1)",
                              transform: "translateX(4px)",
                              transition: "all 0.2s ease",
                            },
                          }}
                        >
                          <div className="flex items-center w-full">
                            <div className="p-2 bg-red-100 rounded-lg mr-3">
                              <LogOut size={18} className="text-red-600" />
                            </div>
                            <span className="font-medium text-red-600">
                              Sign Out
                            </span>
                          </div>
                        </MenuItem>
                      </button>
                    </div>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}

export default Header;
