import { Select } from "@mantine/core";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setCategory } from "../../features/blog/blogSlice.js";
import { useDispatch } from "react-redux";

function CategoryInput() {
  const dispatch = useDispatch();

  useEffect(() => {
    // import("@mantine/core/styles.css");
    // import("@mantine/core/styles.layer.css");
  }, []);

  const handleChange = (e) => {
    dispatch(setCategory(e.target.value));
  };

  const categories = useSelector((state) => state.constants.interests);

  return (
    <>
      <div className="">
        <label htmlFor="category" className="text-lg font-semibold">
          Category
        </label>
        <select
          id="category"
          name="category"
          className="border border-gray-600 rounded block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default CategoryInput;
