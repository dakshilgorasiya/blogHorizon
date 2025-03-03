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
            console.log(response.data);
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
    console.log(insertIndex, newField);
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

      console.log(response);
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

      console.log(response);
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

                      <div className="w-max flex justify-center ml-9 col-span-2">
                        <button
                          onClick={() => removeField(i)}
                          className="w-10 h-10 flex mt-[20px] items-center justify-center border-2 border-secondary rounded-full text-lg font-bold transition-all duration-300 hover:bg-secondary hover:text-white"
                        >
                          <Trash2Icon />
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

      {error && (
        <div className="flex justify-center m-10">
          <p className="text-red-500 font-medium text-md">{error}</p>
        </div>
      )}

      <div className="flex justify-center mb-10">
        {loading ? (
          <button
            className="bg-gray-800 hover:bg-highlight text-white font-bold py-2 px-4 rounded-lg shadow-md cursor-not-allowed"
            disabled
          >
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
            className="bg-gray-800 hover:bg-highlight text-white font-bold py-2 px-4 rounded-lg shadow-md"
          >
            {update ? "Update" : "Create"}
          </button>
        )}
      </div>
    </>
  );
}

export default CreateBlogPage;
