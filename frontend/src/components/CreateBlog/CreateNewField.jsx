import React, { useState } from "react";
import { LetterText, Image, CodeXml } from "lucide-react";

function CreateNewField({ actions }) {
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
        className={`flex gap-2 ml-4 transition-all duration-500 ${
          showOptions ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        <button
          onClick={(e)=>{
            e.preventDefault();
            actions[0]();
            setShowOptions(false);
          }}
          className="w-8 h-8 mt-1 flex items-center justify-center border-2 border-secondary rounded-full text-lg font-bold transition-all duration-300 hover:bg-secondary hover:text-white"
        >
          <LetterText />
        </button>
        <button
          onClick={(e)=>{
            e.preventDefault();
            actions[1]();
            setShowOptions(false);
          }}
          className="w-8 h-8 mt-1 flex items-center justify-center border-2 border-secondary rounded-full text-lg font-bold transition-all duration-300 hover:bg-secondary hover:text-white"
        >
          <Image />
        </button>
        <button
          onClick={(e)=>{
            e.preventDefault();
            actions[2]();
            setShowOptions(false);
          }}
          className="w-8 h-8 mt-1 flex items-center justify-center border-2 border-secondary rounded-full text-lg font-bold transition-all duration-300 hover:bg-secondary hover:text-white"
        >
          <CodeXml />
        </button>
      </div>
    </div>
  );
}

export default CreateNewField;
