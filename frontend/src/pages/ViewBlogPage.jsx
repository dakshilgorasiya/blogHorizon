import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../constants.js";
import { setApiBlog } from "../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";
import {
  Code,
  Image,
  Text,
  Title,
  UserDetails,
  DeleteBlog,
} from "../components";
import { Link } from "react-router-dom";
import { callSecureApi } from "../utils/callSecureApi.js";
import { Pencil, Trash2 } from "lucide-react";
import { Tooltip } from "@mui/material";

function ViewBlogPage() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const { id } = useParams();

  const content = useSelector((state) => state.blog.blog.content);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData(accessToken = user?.accessToken) {
      try {
        setLoading(true);

        const response = await callSecureApi({
          url: `${server}/blog/get-blog-by-id/${id}`,
          method: "GET",
          accessToken,
          setError,
          dispatch,
        });

        dispatch(setApiBlog(response.data));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else
    return (
      <>
        <div className="">
          <div className="sm:w-11/12 mt-10 p-5 max-w-5xl m-auto flex justify-between items-center">
            <Title />

            <div className="flex">
              <div className="mt-1">
                <button>
                  <Link to={`/edit-blog/${id}`}>
                    <Tooltip title="Edit" arrow>
                      <Pencil size={20} />
                    </Tooltip>
                  </Link>
                </button>
              </div>
              <div>
                <DeleteBlog id={id} />
              </div>
            </div>
          </div>
          <div className="sm:w-11/12 px-5 max-w-5xl m-auto">
            <Image imageLink={content[0].data} />
          </div>
          <div className="sm:w-11/12 p-5 max-w-5xl m-auto">
            <UserDetails />
          </div>
          <div className="sm:w-11/12 p-5 max-w-5xl m-auto">
            {content.map(
              (item, index) =>
                index != 0 && (
                  <div key={index} className="mb-5">
                    {item.type === "text" && <Text text={item.data} />}
                    {item.type === "code" && <Code data={item.data} />}
                    {item.type === "image" && <Image imageLink={item.data} />}
                  </div>
                )
            )}
          </div>
        </div>
      </>
    );
}

export default ViewBlogPage;
