import React, { useEffect, useState } from "react";
import {
  TextEditor,
  UploadImage,
  CreateNewField,
  CodeEditor,
} from "../components";
import "@mantine/tiptap/styles.css";
import { MantineProvider } from "@mantine/core";

function CreateBlogPage() {
  const options = ["A", "B", "C"];

  const actions = [
    () => console.log("A"),
    () => console.log("B"),
    () => console.log("C"),
  ];

  const [image, setImage] = useState(null);

  return (
    <>
      <MantineProvider>
        <div className="box-border sm:w-3/4 m-auto border-2 border-black mt-5 max-w-5xl">
          <div className="p-5 grid gap-5s">
            {/* <UploadImage /> */}
            {/* <TextEditor index={0} /> */}
            {/* <UploadImage /> */}
            {/* <TextEditor index={1} /> */}
            <CodeEditor />
            {/* <CreateNewField options={options} actions={actions} /> */}
          </div>
        </div>
      </MantineProvider>
    </>
  );
}

export default CreateBlogPage;
