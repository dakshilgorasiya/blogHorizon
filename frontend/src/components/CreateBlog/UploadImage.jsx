import React, { useState } from "react";
import { Plus } from "lucide-react";

function UploadImage() {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    e.preventDefault();
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <>
      <div className="">
        <div className="">
          <label className="w-full min-h-40 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer">
            <input type="file" className="hidden" onChange={handleFileChange} />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="">
                <Plus />
              </span>
            )}
          </label>
        </div>
      </div>
    </>
  );
}

export default UploadImage;
