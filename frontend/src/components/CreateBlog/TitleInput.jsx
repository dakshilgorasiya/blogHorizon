import React, { useState, useEffect } from "react";
import { setTitle } from "../../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { PenTool, Sparkles, Hash } from "lucide-react";

function TitleInput() {
  const dispatch = useDispatch();
  const title = useSelector((state) => state.blog.blog.title);
  const [tempTitle, setTempTitle] = useState(title || "");
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setTempTitle(title || "");
    setCharCount((title || "").length);
  }, [title]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setTempTitle(newValue);
    setCharCount(newValue.length);
  };

  const handleBlur = () => {
    setIsFocused(false);
    dispatch(setTitle(tempTitle));
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div className="relative group">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-purple-200 rounded-full opacity-10 blur-3xl group-focus-within:opacity-20 transition-opacity duration-500"></div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-200 rounded-full opacity-10 blur-3xl group-focus-within:opacity-20 transition-opacity duration-500"></div>
      </div>

      {/* Main container with glass morphism */}
      <div
        className={`relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 
                      transition-all duration-500 ease-out overflow-hidden
                      ${
                        isFocused
                          ? "shadow-3xl scale-[1.02] bg-white/90"
                          : "hover:shadow-3xl hover:bg-white/85"
                      }`}
      >
        {/* Gradient border effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 
                        opacity-0 transition-opacity duration-500 
                        ${
                          isFocused ? "opacity-100" : "group-hover:opacity-50"
                        }`}
        ></div>

        {/* Header section */}
        <div className="relative p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`p-3 rounded-2xl shadow-lg transition-all duration-300
                              ${
                                isFocused
                                  ? "bg-gradient-to-r from-purple-600 to-blue-600 scale-110"
                                  : "bg-gradient-to-r from-gray-400 to-gray-500"
                              }`}
              >
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Article Title
                </h3>
                <p className="text-sm text-gray-500">
                  Create an engaging headline for your content
                </p>
              </div>
            </div>

            {/* Sparkle decoration */}
            <div
              className={`transition-all duration-300 ${
                isFocused ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
            >
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Input section */}
        <div className="relative px-6 pb-6">
          {/* Icon decoration */}
          <div className="absolute left-10 top-1/2 transform -translate-y-1/2 z-10">
            <Hash
              className={`w-8 h-8 transition-all duration-300 
                            ${
                              isFocused
                                ? "text-purple-600 scale-110"
                                : "text-gray-400"
                            }`}
            />
          </div>

          {/* Title input */}
          <input
            type="text"
            value={tempTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="Enter your amazing title here..."
            className={`w-full pl-16 pr-6 py-6 text-4xl font-black
                       bg-transparent border-none outline-none
                       placeholder-gray-400 transition-all duration-300
                       ${
                         isFocused
                           ? "text-gray-800 placeholder-gray-500"
                           : "text-gray-700 hover:text-gray-800"
                       }`}
            style={{
              textShadow: isFocused ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
            }}
          />

          {/* Animated underline */}
          <div className="relative mt-2">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full 
                              transition-all duration-500 ease-out
                              ${isFocused ? "w-full" : "w-0"}`}
              ></div>
            </div>
          </div>
        </div>

        {/* Footer with character count and tips */}
        <div
          className={`px-6 pb-6 transition-all duration-300 
                        ${
                          isFocused || tempTitle.length > 0
                            ? "opacity-100 max-h-20"
                            : "opacity-0 max-h-0 overflow-hidden"
                        }`}
        >
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span
                className={`font-medium transition-colors duration-300
                              ${
                                charCount > 60
                                  ? "text-red-500"
                                  : charCount > 40
                                  ? "text-yellow-500"
                                  : "text-green-500"
                              }`}
              >
                {charCount} characters
              </span>
              <span className="text-gray-500">
                {charCount < 30
                  ? "✨ Keep going!"
                  : charCount > 60
                  ? "⚠️ Consider shorter"
                  : "✅ Perfect length"}
              </span>
            </div>
          </div>
        </div>

        {/* Floating shine effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                        -skew-x-12 transition-transform duration-1000
                        ${
                          isFocused ? "translate-x-full" : "-translate-x-full"
                        }`}
        ></div>
      </div>

      {/* Focus ring */}
      <div
        className={`absolute inset-0 rounded-3xl border-4 border-purple-500/30 
                      transition-all duration-300 pointer-events-none
                      ${
                        isFocused
                          ? "opacity-100 scale-105"
                          : "opacity-0 scale-100"
                      }`}
      ></div>
    </div>
  );
}

export default TitleInput;
