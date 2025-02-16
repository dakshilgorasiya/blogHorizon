import React from "react";
import { useSelector } from "react-redux";

function Title() {
  const title = useSelector((state) => state.blog.blog.title);

  return (
    <>
      <h1 className="font-extrabold text-3xl">{title}</h1>
    </>
  );
}

export default Title;
