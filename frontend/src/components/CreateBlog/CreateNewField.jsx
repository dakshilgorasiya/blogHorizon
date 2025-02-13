import React, { useState } from "react";

function CreateNewField({ options, actions }) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="m-5 flex items-center gap-2">
      {/* Main button */}
      <button
        className="w-10 h-10 flex items-center justify-center border-2 border-secondary rounded-full text-lg font-bold transition-all duration-300 hover:bg-secondary hover:text-white"
        onClick={() => setShowOptions(!showOptions)}
      >
        +
      </button>

      {/* Options buttons */}
      <div
        className={`flex gap-2 transition-all duration-500 ${
          showOptions ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        {showOptions &&
          options.map((option, index) => (
            <button
              key={index}
              onClick={actions[index]}
              className="w-10 h-10 flex items-center justify-center border-2 border-secondary rounded-full text-lg font-bold transition-all duration-300 hover:bg-secondary hover:text-white"
            >
              {option[0]} {/* Show first letter or customize */}
            </button>
          ))}
      </div>
    </div>
  );
}

export default CreateNewField;
