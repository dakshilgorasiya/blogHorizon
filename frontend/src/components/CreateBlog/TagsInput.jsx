import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { setTags } from "../../features/blog/blogSlice.js";
import { useDispatch } from "react-redux";

function TagsInput({ oldTags = [] }) {
  useEffect(() => {
    import("@mantine/core/styles.css");
    import("@mantine/core/styles.layer.css");
  }, []);

  const [tagInput, setTagInput] = useState(oldTags.join(" "));

  const dispatch = useDispatch();

  useEffect(() => {
    setTagInput(oldTags.join(" "));
  }, [oldTags]);

  const handleTags = () => {
    dispatch(setTags(tagInput.trim().split(/\s+/)));
  };

  return (
    <>
      <div>
        <label htmlFor="tag" className="text-lg font-semibold">
          Tags
        </label>
        <input
          id="tag"
          name="tag"
          value={tagInput}
          type="text"
          className="border border-gray-600 rounded block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
          onBlur={(e) => handleTags()}
          onChange={(e) => setTagInput(e.target.value)}
        />
      </div>
    </>
  );
}

export default TagsInput;
