import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  CircleUser,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authReducers.js";
import {
  getInterests,
  getUserInterests,
} from "../../features/constants/constantsReducers.js";
import { BadgePlus } from "lucide-react";
import { setUser } from "../../features/auth/authSlice.js";
import axios from "axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { server } from "../../constants.js";
import Tooltip from "@mui/material/Tooltip";
import { Divider } from "@mui/material";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const userInterests = useSelector((state) => state.constants.userInterests);

  const currentInterest = useSelector(
    (state) => state.constants.currentInterest
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    dispatch(getInterests());

    const fetchUser = async () => {
      try {
        const response = await axios
          .post(`${server}/user/renew-access-token`, null, {
            withCredentials: true,
          })
          .then((res) => res.data)
          .catch((error) => {
            throw error;
          });

        dispatch(setUser(response.data));
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
    };
    if (user === null) fetchUser();
  }, [dispatch]);

  useEffect(() => {
    if (user && userInterests.length === 0) {
      dispatch(
        getUserInterests({
          dispatch,
          setError: setErrorMessage,
          accessToken: user.accessToken,
        })
      );
    }
  }, [user, dispatch]);

  return (
    <>
      <div className="bg-priary flex justify-between items-center p-3">
        <div className="p-3">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/bloghorizon/image/upload/v1740303181/wbiauijuf8e4gfz5m5xp.png"
              alt="BlogHorizon"
              className="h-5 md:h-10"
            />
          </Link>
        </div>
        <div className="bg-white flex items-center p-2 rounded-lg w-2/3">
          <input
            type="text"
            placeholder="Search"
            className="rounded-lg focus:outline-none w-full"
          />
          <button>
            <Search size={20} />
          </button>
        </div>

        <div className="p-3">
          {!user ? (
            <button
              className="text-primary p-2 rounded-md"
              onClick={() => navigate("/login")}
            >
              <CircleUser size={25} className="text-white" />
            </button>
          ) : (
            <>
              <div className="flex items-center">
                <div className="mr-5">
                  <Link to="/create-blog">
                    <Tooltip title="Create Blog" placement="left" arrow>
                      <BadgePlus size={25} className="text-white" />
                    </Tooltip>
                  </Link>
                </div>
                <button className="text-primary border-2 border-highlight rounded-full">
                  <img
                    src={user.avatar}
                    alt="avatar"
                    onClick={handleClick}
                    className="h-8 w-8 rounded-full"
                  />
                </button>

                <div className="">
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{ "aria-labelledby": "basic-button" }}
                  >
                    <MenuItem onClick={handleClose}>
                      <div className="grid grid-cols-12 cursor-default">
                        <div className="col-span-3">
                          <img
                            src={user.avatar}
                            alt="avatar"
                            className="h-12 w-12 rounded-full"
                          />
                        </div>
                        <div className="col-span-9">
                          <p>{user.userName}</p>
                          <p>{user.email}</p>
                        </div>
                      </div>
                    </MenuItem>
                    <Divider />
                    <Link to={`/profile/${user._id}`}>
                      <MenuItem onClick={handleClose}>
                        <div className="flex items-center">
                          <CircleUser size={20} className="mr-2" />
                          Profile
                        </div>
                      </MenuItem>
                    </Link>
                    <Link to={`/bookmark`}>
                      <MenuItem onClick={handleClose}>
                        <div className="flex items-center">
                          <Bookmark size={20} className="mr-2" />
                          My Bookmarks
                        </div>
                      </MenuItem>
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(logout());
                        navigate("/");
                      }}
                      className="w-full"
                    >
                      <MenuItem onClick={handleClose}>
                        <div className="flex items-center">
                          <LogOut size={20} className="mr-2 text-red-500" />
                          Logout
                        </div>
                      </MenuItem>
                    </button>
                  </Menu>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
