import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { setContent } from "../../features/blog/blogSlice.js";
import { useDispatch } from "react-redux";

function UploadImage({ index, placeholder }) {
  const dispatch = useDispatch();
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    e.preventDefault();
    const fileURL = URL.createObjectURL(e.target.files[0]);
    setPreview(fileURL);
    dispatch(setContent({ index, type: "image", data: fileURL }));
  };

  useEffect(() => {
    let fileURL = null;
    if (preview) {
      fileURL = preview;
    }
    dispatch(setContent({ index, type: "image", data: fileURL }));
  }, [index]);

  return (
    <div>
      <label className="w-full min-h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer">
        <input type="file" className="hidden" onChange={handleFileChange} />
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center">
            <Plus />
            <p className="text-gray-500 text-sm opacity-70 mt-2">
              {placeholder}
            </p>
          </div>
        )}
      </label>
    </div>
  );
}

export default UploadImage;
