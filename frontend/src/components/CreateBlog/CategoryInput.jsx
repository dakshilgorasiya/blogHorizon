import { useSelector, useDispatch } from "react-redux";
import { setCategory } from "../../features/blog/blogSlice.js";
import { ChevronDown, Tag } from "lucide-react";

function CategoryInput() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.blog.blog.category);
  const categories = useSelector((state) => state.constants.interests);

  const oldCategory = useSelector((state) => state.blog.blog.category);

  const handleChange = (e) => {
    dispatch(setCategory(e.target.value));
  };

  return (
    <div className="space-y-2">
      {/* Label with gradient text */}
      <label
        htmlFor="category"
        className="block text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
      >
        Category
      </label>

      {/* Select container with glass morphism */}
      <div className="relative group">
        {/* Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-purple-600 transition-colors duration-200 z-10">
          <Tag size={20} />
        </div>

        {/* Select dropdown */}
        <select
          id="category"
          name="category"
          onLoad={() => {
            setCategory(oldCategory || "");
          }}
          className="w-full pl-12 pr-12 py-4 
                     bg-white/80 backdrop-blur-xl 
                     border border-gray-200 rounded-xl 
                     shadow-lg hover:shadow-xl 
                     focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500
                     hover:border-purple-300 hover:bg-white/90
                     transition-all duration-300 ease-in-out
                     text-gray-700 font-medium
                     appearance-none cursor-pointer
                     hover:scale-[1.02] active:scale-[0.98]"
          onChange={handleChange}
          value={selectedCategory || ""}
        >
          <option value="" disabled className="text-gray-400">
            Select a category
          </option>
          {categories.map((category) => (
            <option
              key={category}
              value={category}
              className="text-gray-700 py-2"
            >
              {category}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-purple-600 transition-colors duration-200">
          <ChevronDown size={20} />
        </div>

        {/* Focus ring enhancement */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Optional: Selected category indicator */}
      {selectedCategory && (
        <div className="flex items-center space-x-2 text-sm text-purple-600 bg-purple-50 px-3 py-2 rounded-lg animate-in slide-in-from-bottom-2 duration-300">
          <Tag size={16} />
          <span className="font-medium">Selected: {selectedCategory}</span>
        </div>
      )}
    </div>
  );
}

export default CategoryInput;
