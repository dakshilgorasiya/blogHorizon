import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authReducers.js";

function Header() {
  const dispatch = useDispatch();
  return (
    <>
      <Link to="/">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mx-5">
          HOME
        </button>
      </Link>
      <Link to="/login">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mx-5">
          Login
        </button>
      </Link>
      <Link to="/register">
        <button className="bg-blue-500 text-white px-4 py-2 mx-5 rounded hover:bg-blue-700">
          Register
        </button>
      </Link>
      <Link to="/forgot-password">
        <button className="bg-blue-500 text-white px-4 py-2 mx-5 rounded hover:bg-blue-700">
          Forgot Password
        </button>
      </Link>
      <Link to="/reset-password/1245">
        <button className="bg-blue-500 text-white px-4 py-2 mx-5 rounded hover:bg-blue-700">
          Reset Password
        </button>
      </Link>
      <Link to="/view-blog/67b1d0057f26638640cf75a5">
        <button className="bg-blue-500 text-white px-4 py-2 mx-5 rounded hover:bg-blue-700">
          View Blog
        </button>
      </Link>
      <button
        className="bg-blue-500 text-white px-4 py-2 mx-5 rounded hover:bg-blue-700"
        onClick={() => dispatch(logout())}
      >
        Logout
      </button>
      <Link to="/complete-profile">
        <button className="bg-blue-500 text-white px-4 py-2 mx-5 rounded hover:bg-blue-700">
          Complete Profile
        </button>
      </Link>
      <Link to="/profile/67b1c637927d53d6d076742e">
        <button className="bg-blue-500 text-white px-4 py-2 mx-5 rounded hover:bg-blue-700">
          Profile
        </button>
      </Link>
    </>
  );
}

export default Header;
