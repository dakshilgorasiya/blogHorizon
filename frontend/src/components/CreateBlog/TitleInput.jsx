import React, { useState, useEffect } from "react";
import { setTitle } from "../../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";

function TitleInput() {
  const dispatch = useDispatch();

  const title = useSelector((state) => state.blog.blog.title);

  const [tempTitle, setTempTitle] = useState(title);

  useEffect(() => {
    setTempTitle(title);
  }, [title]);

  return (
    <input
      type="text"
      value={tempTitle}
      onChange={(e) => setTempTitle(e.target.value)}
      onBlur={(e) => dispatch(setTitle(tempTitle))}
      placeholder="Title"
      className={`w-full p-2 pl-5 text-3xl font-extrabold rounded shadow-sm shadow-gray-500`}
    />
  );
}

export default TitleInput;
