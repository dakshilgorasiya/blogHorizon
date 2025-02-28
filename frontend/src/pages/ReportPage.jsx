import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { server } from "../constants.js";
import { callSecureApi } from "../utils/callSecureApi.js";
import { useNavigate } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import axios from "axios";
import { sendNotification } from "../features/notification/notificationSlice.js";

function ReportPage() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");

  const user = useSelector((state) => state.auth.user);

  const [blogTitle, setBlogTitle] = useState("");

  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!title || !content) {
      setError("Title and content are required");
      return;
    }

    setLoading(true);

    try {
      const response = await callSecureApi({
        url: `${server}/report/create-report`,
        method: "POST",
        body: {
          title,
          content,
          blogId: id,
        },
        dispatch,
        setError,
        accessToken: user?.accessToken,
      });

      if (response?.success) {
        navigate(`/view-blog/${id}`);
        dispatch(
          sendNotification({
            message: "Report submitted successfully",
            type: "success",
          })
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate("/");
    }

    const fetchTitle = async () => {
      try {
        const response = await axios
          .get(`${server}/blog/get-blog-title/${id}`)
          .then((res) => res.data);

        if (response.success) {
          setBlogTitle(response.data.title);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTitle();
  }, [id]);

  return (
    <>
      <div className="flex justify-center p-5">
        <div className="border-2 border-red-500 rounded-lg p-4 shadow-md w-full max-w-md">
          <div className="flex justify-center items-center m-5">
            <TriangleAlert className="text-red-500" size={40} />
            <h1 className="text-4xl text-center font-extrabold text-red-500 mx-5">
              Report Blog
            </h1>
            <TriangleAlert className="text-red-500" size={40} />
          </div>

          <div className="mb-5 mt-10">
            <label className="text-lg inline-block" htmlFor="blogId">
              Blog Id
            </label>
            <input
              id="blogId"
              type="text"
              disabled
              className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:cursor-not-allowed"
              value={id}
            />
          </div>

          <div className="mb-5">
            <label className="text-lg inline-block" htmlFor="blogTitle">
              Blog Title
            </label>
            <input
              id="blogTitle"
              type="text"
              className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:cursor-not-allowed"
              value={blogTitle}
            />
          </div>

          <div className="mb-5">
            <label className="text-lg inline-block" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              value={title}
            />
          </div>

          <div className="mb-5">
            <label className="text-lg inline-block" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              className="border border-gray-600 rounded-lg block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
            />
          </div>

          {error && (
            <div className="flex justify-center m-10">
              <p className="text-red-500 font-medium text-md">{error}</p>
            </div>
          )}

          <div className="flex justify-center my-10">
            {loading ? (
              <button
                className="bg-gray-800 hover:bg-highlight text-white font-bold py-2 px-4 rounded-lg shadow-md"
                disabled
              >
                Loading...
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => handleSubmit(e)}
                className="bg-gray-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportPage;
