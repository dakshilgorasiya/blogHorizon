import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../constants.js";
import { setApiBlog } from "../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Code, Image, Text, Title, UserDetails } from "../components";

function ViewBlogPage() {
  const dispatch = useDispatch();

  const { id } = useParams();

  const user = useSelector((state) => state.auth.user);

  const content = useSelector((state) => state.blog.blog.content);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios
          .get(`${server}/blog/getBlogById/${id}`, {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          })
          .then((res) => res.data);
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
          <div className="sm:w-11/12 mt-10 p-5 max-w-5xl m-auto">
            <Title />
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
