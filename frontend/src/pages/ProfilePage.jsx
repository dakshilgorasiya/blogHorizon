import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserInfo, UserBlog } from "../components";
import axios from "axios";
import { server } from "../constants.js";
import { useSelector, useDispatch } from "react-redux";

function ProfilePage() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios
          .get(`${server}/user/user-profile/${id}`, {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          })
          .then((res) => res.data);

        console.log(response.data);

        response.data.blogs.map((blog) => {
          blog.owner = response.data;
          blog.followersCount = response.data.followers;
          blog.likeCount = blog.likes;
          blog.commentCount = blog.comments;
        });

        setData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-center">
        <div className="lg:grid lg:grid-cols-12 py-5 max-w-7xl">
          <div className="col-span-3 md:col-span-4 xl:col-span-3">
            <UserInfo data={data} ownerId={id} />
          </div>
          <div className="col-span-9 md:col-span-8 xl:col-span-9">
            <UserBlog data={data} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
