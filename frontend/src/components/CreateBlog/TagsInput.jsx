import { useState, useEffect } from "react";
import { Tag, Hash } from "lucide-react";
import { setTags } from "../../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";

function TagsInput() {
  useEffect(() => {
    import("@mantine/core/styles.css");
    import("@mantine/core/styles.layer.css");
  }, []);

  const oldTags = useSelector((state) => state.blog.blog.tags);
  const [tagInput, setTagInput] = useState(oldTags.join(" "));
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setTagInput(oldTags.join(" "));
  }, [oldTags]);

  const handleTags = () => {
    const cleanedTags = tagInput
      .trim()
      .split(/\s+/)
      .filter((tag) => tag.length > 0);
    dispatch(setTags(cleanedTags));
  };

  // Parse tags for display
  const parsedTags = tagInput
    .trim()
    .split(/\s+/)
    .filter((tag) => tag.length > 0);

  return (
    <div className="w-full space-y-3">
      {/* Label with gradient */}
      <label
        htmlFor="tag"
        className="inline-flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
      >
        <Tag className="w-5 h-5 text-purple-600" />
        Tags
      </label>

      {/* Input container with glass morphism */}
      <div className="relative">
        <div
          className={`
          relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border transition-all duration-300 ease-in-out
          ${
            isFocused
              ? "border-purple-400 shadow-xl ring-4 ring-purple-500/20 scale-[1.02]"
              : "border-gray-200 hover:border-purple-300 hover:shadow-xl"
          }
        `}
        >
          {/* Hash icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Hash
              className={`w-5 h-5 transition-colors duration-200 ${
                isFocused ? "text-purple-600" : "text-gray-400"
              }`}
            />
          </div>

          {/* Input field */}
          <input
            id="tag"
            name="tag"
            value={tagInput}
            type="text"
            placeholder="Enter tags separated by spaces..."
            className="w-full pl-12 pr-4 py-4 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-base font-medium rounded-2xl"
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              handleTags();
            }}
            onChange={(e) => setTagInput(e.target.value)}
          />
        </div>

        {/* Decorative gradient border effect */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-2xl opacity-0 -z-10 transition-opacity duration-300
          ${isFocused ? "opacity-20" : ""}
        `}
          style={{ padding: "2px" }}
        >
          <div className="w-full h-full bg-white rounded-2xl"></div>
        </div>
      </div>

      {/* Tag preview with animations */}
      {parsedTags.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-600 mb-2 w-full">
              Preview ({parsedTags.length} tag
              {parsedTags.length !== 1 ? "s" : ""}):
            </span>
            {parsedTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-sm transform transition-all duration-200 hover:scale-105"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: "fadeInUp 0.3s ease-out forwards",
                }}
              >
                <Hash className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Subtle help text */}
      <p className="text-sm text-gray-500 ml-1">
        Separate multiple tags with spaces. Tags will be automatically processed
        when you finish typing.
      </p>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default TagsInput;
