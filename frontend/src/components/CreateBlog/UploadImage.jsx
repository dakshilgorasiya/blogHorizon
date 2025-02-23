import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { setContent } from "../../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";

function UploadImage({ index, placeholder }) {
  const dispatch = useDispatch();

  const oldImage = useSelector(
    (state) => state?.blog?.blog?.content[index]?.data
  );

  useEffect(() => {
    if (oldImage) {
      setPreview(oldImage);
    } else {
      setPreview(null);
    }
  }, [oldImage]);

  const [preview, setPreview] = useState(oldImage);

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
      <label className="w-full min-h-40 max-h-96 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer">
        <input type="file" className="hidden" onChange={handleFileChange} />
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full max-h-96 object-cover rounded-lg"
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
