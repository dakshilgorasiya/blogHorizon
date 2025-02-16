import React from "react";
import { useParams } from "react-router-dom";

function ViewBlog() {
  const { id } = useParams();

  return (
    <>
      {id}
      <div>ViewBlog</div>
    </>
  );
}

export default ViewBlog;
