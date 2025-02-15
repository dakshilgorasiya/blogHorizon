import React, { useState } from "react";
import {
  TextEditor,
  UploadImage,
  CreateNewField,
  CodeEditor,
  CategoryInput,
  TagsInput,
} from "../components";
import "@mantine/tiptap/styles.css";
import { MantineProvider } from "@mantine/core";
import { Trash2Icon } from "lucide-react";
import { removeContent, setTitle } from "../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../constants.js";

function CreateBlogPage() {
  const dispatch = useDispatch();

  const [index, setIndex] = useState(1);
  const [contentType, setContentType] = useState(["image"]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addField = (type, insertIndex) => {
    const newField = type;
    setContentType((prevContent) => {
      const updatedContent = [...prevContent];
      updatedContent.splice(insertIndex, 0, newField); // Insert at specific index
      return updatedContent;
    });
    setIndex((prev) => prev + 1); // Increment index for next item
  };

  const removeField = (index) => {
    setContentType((prevContent) => {
      const updatedContent = [...prevContent];
      updatedContent.splice(index, 1); // Remove at specific index
      return updatedContent;
    });
    dispatch(removeContent({ index }));
  };

  const content = useSelector((state) => state.blog.content);

  const user = useSelector((state) => state.user);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    if (content[0].data === null) {
      setError("Please add a thumbnail");
      setLoading(false);
      return;
    }

    if (contentType.length === 1) {
      setError("Please add more content");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    await Promise.all(
      content.map(async (item, index) => {
        if (item.type === "image") {
          const response = await fetch(item.data);
          const blob = await response.blob();
          const file = new File([blob], `image${index}.jpg`, {
            type: blob.type,
          });
          console.log("Appending file:", file);
          formData.append("images", file);
        }
      })
    );

    formData.append("content", JSON.stringify(content));

    // Log formData content (use for debugging)
    console.log("FormData before sending:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(`${server}/blog/createBlog`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-center sm:w-11/12 mt-10 p-5 max-w-5xl m-auto">
        <input
          type="text"
          onBlur={(e) => dispatch(setTitle(e.target.value))}
          placeholder="Title"
          className={`w-full p-2 pl-5 text-3xl font-extrabold rounded shadow-sm shadow-gray-500`}
        />
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
