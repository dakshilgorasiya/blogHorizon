import React, { useState } from "react";
import { LetterText, Image, CodeXml, Plus } from "lucide-react";

function CreateNewField({ actions }) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative m-5 flex items-center gap-2">
      {/* Decorative background elements */}
      <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-2xl opacity-15 animate-pulse"></div>
      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-15 animate-pulse delay-500"></div>

      <div className="relative flex items-center gap-4">
        {/* Main button */}
        <button
          className="group relative w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-md border-2 border-white/50 rounded-full text-lg font-bold transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 shadow-lg"
          onClick={() => setShowOptions(!showOptions)}
        >
          <div
            className={`transition-all duration-300 ${
              showOptions ? "rotate-45" : "rotate-0"
            }`}
          >
            <Plus size={20} className="stroke-2" />
          </div>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>

        {/* Options buttons container */}
        <div
          className={`flex gap-3 transition-all duration-500 ease-out ${
            showOptions
              ? "opacity-100 scale-100 translate-x-0"
              : "opacity-0 scale-75 -translate-x-4 pointer-events-none"
          }`}
        >
          {/* Text button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              actions[0]();
              setShowOptions(false);
            }}
            className="group relative w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md border-2 border-white/50 rounded-full transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 shadow-md"
            title="Add Text"
          >
            <LetterText size={16} className="stroke-2" />

            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Add Text
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>

          {/* Image button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              actions[1]();
              setShowOptions(false);
            }}
            className="group relative w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md border-2 border-white/50 rounded-full transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-green-500/25 active:scale-95 shadow-md"
            title="Add Image"
          >
            <Image size={16} className="stroke-2" />

            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Add Image
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>

          {/* Code button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              actions[2]();
              setShowOptions(false);
            }}
            className="group relative w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md border-2 border-white/50 rounded-full transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-orange-500/25 active:scale-95 shadow-md"
            title="Add Code"
          >
            <CodeXml size={16} className="stroke-2" />

            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Add Code
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Animated stagger effect for options */}
      <style jsx>{`
        @keyframes slideInStagger {
          0% {
            opacity: 0;
            transform: translateX(-10px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .flex > button:nth-child(1) {
          animation-delay: 0ms;
        }
        .flex > button:nth-child(2) {
          animation-delay: 100ms;
        }
        .flex > button:nth-child(3) {
          animation-delay: 200ms;
        }

        ${showOptions
          ? `
          .flex > button {
            animation: slideInStagger 0.3s ease-out forwards;
          }
        `
          : ""}
      `}</style>
    </div>
  );
}

export default CreateNewField;
