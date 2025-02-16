import React from "react";
import { setTitle } from "../../features/blog/blogSlice.js";
import { useDispatch } from "react-redux";

function TitleInput() {
  const dispatch = useDispatch();

  return (
    <input
      type="text"
      onBlur={(e) => dispatch(setTitle(e.target.value))}
      placeholder="Title"
      className={`w-full p-2 pl-5 text-3xl font-extrabold rounded shadow-sm shadow-gray-500`}
    />
  );
}

export default TitleInput;
