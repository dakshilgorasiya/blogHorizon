import React, { useEffect } from "react";
import { TextEditor } from "../components";
import "@mantine/tiptap/styles.css";
import { MantineProvider } from "@mantine/core";

function CreateBlogPage() {
  useEffect(() => {
    import("@mantine/core/styles.css");
  }, []);

  return (
    <>
      <MantineProvider>
        <div className="p-5 m-5">
          <TextEditor index={0} />
        </div>
      </MantineProvider>
    </>
  );
}

export default CreateBlogPage;
