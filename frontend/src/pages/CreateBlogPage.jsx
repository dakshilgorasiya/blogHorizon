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
  setTitle,
  resetBlog,
} from "../features/blog/blogSlice.js";
import { getInterests } from "../features/constants/constantsReducers.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../constants.js";
import { useNavigate } from "react-router-dom";
import { callSecureApi } from "../utils/callSecureApi.js";
import { renewAccessToken } from "../utils/renewAccessToken.js";

function CreateBlogPage() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  // const [index, setIndex] = useState(1);
  const [contentType, setContentType] = useState(["image"]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getInterests());

    const renew = async () => {
      await renewAccessToken({ dispatch, setError });
    };

    renew();
  }, []);

  const addField = (type, insertIndex) => {
    const newField = type;
    setContentType((prevContent) => {
      const updatedContent = [...prevContent];
      updatedContent.splice(insertIndex, 0, newField); // Insert at specific index
      return updatedContent;
    });
    // setIndex((prev) => prev + 1); // Increment index for next item
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

  const handleSubmit = async () => {
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

    blog.tags.map((tag) => {
      if (tag[0] !== "#") {
        setError("Please add tags with #");
        setLoading(false);
        return;
      }
    });

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
      // const response = await axios
      //   .post(`${server}/blog/create-blog`, formData, {
      //     headers: {
      //       Authorization: `Bearer ${user.accessToken}`,
      //     },
      //   })
      //   .then((res) => res.data);

      const response = await callSecureApi({
        url: `${server}/blog/create-blog`,
        method: "POST",
        body: formData,
        accessToken: user?.accessToken,
        setError,
        dispatch,
      });

      console.log(response);
      navigate(`/view-blog/${response.data._id}`);
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
            onClick={(e) => handleSubmit(e)}
            className="bg-gray-800 hover:bg-highlight text-white font-bold py-2 px-4 rounded-lg shadow-md"
          >
            Save
          </button>
        )}
      </div>
    </>
  );
}

export default CreateBlogPage;
