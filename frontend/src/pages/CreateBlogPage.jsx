import React, { useEffect, useState } from "react";
import {
  TextEditor,
  UploadImage,
  CreateNewField,
  CodeEditor,
  CategoryInput,
  TagsInput,
  TitleInput,
} from "../components";
import "@mantine/tiptap/styles.css";
import { MantineProvider } from "@mantine/core";
import { Trash2Icon } from "lucide-react";
import {
  removeContent,
  resetBlog,
  setApiBlog,
  addEmptyField,
} from "../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../constants.js";
import { useNavigate, useParams } from "react-router-dom";
import useSecureAPI from "../hooks/useSecureApi.js";
import { sendNotification } from "../features/notification/notificationSlice.js";

function CreateBlogPage({ update = false }) {
  const { id } = useParams();

  const { callAPI } = useSecureAPI();

  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  // const [index, setIndex] = useState(1);
  const [contentType, setContentType] = useState(["image"]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!update) {
      dispatch(resetBlog());
      setError("");
      setLoading(false);
      setContentType(["image"]);
    }
  }, [dispatch, id, update]);

  useEffect(() => {
    if (update && user) {
      const fetchBlog = async () => {
        try {
          const response = await axios
            .get(`${server}/blog/get-blog-by-id/${id}`)
            .then((res) => res.data);
          if (response.success) {
            if (response.data.owner?._id !== user?._id) {
              navigate("/");
            }
            dispatch(setApiBlog(response.data));
            setContentType(response.data.content.map((item) => item.type));
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
        }
      };

      fetchBlog();
    }
  }, [update, user, id, dispatch, navigate]);

  const addField = (type, insertIndex) => {
    const newField = type;
    setContentType((prevContent) => {
      const updatedContent = [...prevContent];
      updatedContent.splice(insertIndex, 0, newField); // Insert at specific index
      return updatedContent;
    });
    dispatch(addEmptyField({ type: newField, index: insertIndex }));
  };

  const removeField = (index) => {
    setContentType((prevContent) => {
      const updatedContent = [...prevContent];
      updatedContent.splice(index, 1); // Remove at specific index
      return updatedContent;
    });
    dispatch(removeContent({ index }));
  };

  const blog = useSelector((state) => state.blog.blog);

  const handleCreate = async () => {
    setError("");
    setLoading(true);

    // Error handling
    if (blog.title === "") {
      setError("Please add a title");
      setLoading(false);
      return;
    }

    if (blog.content[0].data === null) {
      setError("Please add a thumbnail");
      setLoading(false);
      return;
    }

    if (contentType.length === 1) {
      setError("Please add more content");
      setLoading(false);
      return;
    }

    if (blog.category === "") {
      setError("Please add a category");
      setLoading(false);
      return;
    }

    if (blog.tags.length === 0) {
      setError("Please add tags");
      setLoading(false);
      return;
    }

    let shouldReturn = false;

    blog.tags.map((tag) => {
      if (tag[0] !== "#") {
        setError("Please add tags with #");
        setLoading(false);
        shouldReturn = true;
        return;
      }
    });

    if (shouldReturn) {
      return;
    }

    // Calling API to create blog
    const formData = new FormData();

    await Promise.all(
      blog.content.map(async (item, index) => {
        if (item.type === "image") {
          const response = await fetch(item.data);
          const blob = await response.blob();
          const file = new File([blob], `image${index}.jpg`, {
            type: blob.type,
          });
          formData.append("images", file);
        }
      })
    );

    formData.append("title", blog.title);
    formData.append("content", JSON.stringify(blog.content));
    formData.append("category", blog.category);
    formData.append("tags", JSON.stringify(blog.tags));

    try {
      const response = await callAPI({
        url: `${server}/blog/create-blog`,
        method: "POST",
        body: formData,
        accessToken: user?.accessToken,
        setError,
        dispatch,
      });
      if (response?.success) {
        dispatch(
          sendNotification({
            message: "Blog created successfully",
            type: "success",
          })
        );
        navigate(`/view-blog/${response.data._id}`);
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };

  const handleUpdate = async () => {
    setError("");
    setLoading(true);

    // Error handling
    if (blog.title === "") {
      setError("Please add a title");
      setLoading(false);
      return;
    }

    if (blog.content[0].data === null) {
      setError("Please add a thumbnail");
      setLoading(false);
      return;
    }

    if (contentType.length === 1) {
      setError("Please add more content");
      setLoading(false);
      return;
    }

    if (blog.category === "") {
      setError("Please add a category");
      setLoading(false);
      return;
    }

    if (blog.tags.length === 0) {
      setError("Please add tags");
      setLoading(false);
      return;
    }

    let shouldReturn = false;

    blog.tags.map((tag) => {
      if (tag[0] !== "#") {
        setError("Please add tags with #");
        setLoading(false);
        shouldReturn = true;
        return;
      }
    });

    if (shouldReturn) {
      return;
    }

    // Calling API to update blog
    const formData = new FormData();

    await Promise.all(
      blog.content.map(async (item, index) => {
        if (
          item.type === "image" &&
          typeof item.data === "string" &&
          item.data.startsWith("blob:")
        ) {
          const response = await fetch(item.data);
          const blob = await response.blob();
          const file = new File([blob], `image${index}.jpg`, {
            type: blob.type,
          });
          formData.append("updatedImages", file);
        }
      })
    );

    formData.append("title", blog.title);
    formData.append("content", JSON.stringify(blog.content));
    formData.append("category", blog.category);
    formData.append("tags", JSON.stringify(blog.tags));

    try {
      const response = await callAPI({
        url: `${server}/blog/update-blog/${id}`,
        method: "PUT",
        body: formData,
        accessToken: user?.accessToken,
        setError,
        dispatch,
      });
      if (response.success) {
        navigate(`/view-blog/${id}`);
        dispatch(
          sendNotification({
            message: "Blog updated successfully",
            type: "success",
          })
        );
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="sm:w-11/12 mt-10 p-5 max-w-5xl m-auto">
        <TitleInput />
      </div>

      <MantineProvider>
        <div className="box-border sm:w-11/12 m-auto mt-5 max-w-5xl">
          <div className="p-5 grid gap-5">
            <UploadImage index={0} placeholder="Upload a thumbnail" />
            <div className="grid gap-5">
              {contentType.map(
                (content, i) =>
                  i != 0 && (
                    <div key={i} className="grid grid-cols-12 ">
                      {/* Left content area (Editor, Image, Code) */}
                      <div className="col-span-10">
                        {content === "text" && <TextEditor index={i} />}
                        {content === "image" && (
                          <UploadImage
                            index={i}
                            placeholder="Upload an image"
                          />
                        )}
                        {content === "code" && <CodeEditor index={i} />}
                      </div>

                      <div className="w-max flex justify-center ml-9 mt-5 col-span-2">
                        <button
                          onClick={() => removeField(i)}
                          className="group relative w-12 h-12 flex mt-[20px] items-center justify-center bg-white/80 backdrop-blur-md border-2 border-white/50 rounded-full transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-red-500/25 active:scale-95 shadow-md"
                          title="Delete Field"
                        >
                          <Trash2Icon size={16} className="stroke-2" />

                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Delete Field
                          </div>

                          {/* Ripple effect */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </button>

                        <div className="w-auto">
                          <CreateNewField
                            actions={[
                              () => addField("text", i + 1),
                              () => addField("image", i + 1),
                              () => addField("code", i + 1),
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>

            <CreateNewField
              actions={[
                () => addField("text", contentType.length),
                () => addField("image", contentType.length),
                () => addField("code", contentType.length),
              ]}
            />
          </div>
        </div>
      </MantineProvider>

      <div className="sm:w-11/12 mt-10 p-5 max-w-5xl m-auto">
        <MantineProvider>
          <CategoryInput />
        </MantineProvider>
      </div>

      <div className="sm:w-11/12 mt-10 p-5 max-w-5xl m-auto">
        <TagsInput />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex justify-center m-10">
          <div className="bg-red-50/80 backdrop-blur-md border border-red-200/50 rounded-xl px-6 py-4 shadow-lg">
            <p className="text-red-600 font-medium text-md flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-center mb-16 px-5">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-2 border border-white/40 shadow-lg">
          {loading ? (
            <button
              className="group relative bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold py-4 px-12 rounded-xl shadow-lg cursor-not-allowed transition-all duration-300 flex items-center gap-3"
              disabled
            >
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Loading...
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                if (update) {
                  handleUpdate();
                } else {
                  handleCreate();
                }
              }}
              className="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 active:scale-95 flex items-center gap-3"
            >
              <span className="relative z-10">
                {update ? "Update Content" : "Create Content"}
              </span>

              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>

              {/* Success icon */}
              <svg
                className="w-5 h-5 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default CreateBlogPage;
