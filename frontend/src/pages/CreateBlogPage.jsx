import React, { useState } from "react";
import {
  TextEditor,
  UploadImage,
  CreateNewField,
  CodeEditor,
} from "../components";
import "@mantine/tiptap/styles.css";
import { MantineProvider } from "@mantine/core";
import { Trash2Icon } from "lucide-react";
import { removeContent } from "../features/blog/blogSlice.js";
import { useDispatch } from "react-redux";

function CreateBlogPage() {
  const dispatch = useDispatch();

  const [index, setIndex] = useState(1);
  const [contentType, setContentType] = useState([]);

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

  const handleSubmit = () => {
    if (contentType.length === 1) {
      setError("Please add more content");
      return;
    }
  };

  return (
    <>
      <MantineProvider>
        <div className="box-border sm:w-3/4 m-auto mt-5 max-w-5xl">
          <div className="p-5 grid gap-5">
            <UploadImage index={0} placeholder="Upload a thumbnail" />
            <div className="grid gap-5">
              {contentType.map(
                (content, i) =>
                  i != 0 && (
                    <div key={content.index} className="grid grid-cols-12 ">
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
