import { useSelector, useDispatch } from "react-redux";
import { setCategory } from "../../features/blog/blogSlice.js";

function CategoryInput({ oldCategory }) {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.blog.blog.category); 
  const categories = useSelector((state) => state.constants.interests);

  const handleChange = (e) => {
    dispatch(setCategory(e.target.value));
  };

  return (
    <div>
      <label htmlFor="category" className="text-lg font-semibold">
        Category
      </label>
      <select
        id="category"
        name="category"
        onLoad={() => {
          setCategory(oldCategory);
        }}
        className="border border-gray-600 rounded block box-border w-full p-1 px-3 hover:border-gray-800 hover:border-2"
        onChange={handleChange}
        value={selectedCategory || ""} // Ensure empty selection initially
      >
        <option value="" disabled>
          Select a category
        </option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryInput;
