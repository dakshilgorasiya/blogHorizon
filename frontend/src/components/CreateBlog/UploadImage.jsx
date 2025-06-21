import React, { useEffect, useState } from "react";
import { Plus, Upload, ImageIcon, X, Camera, Sparkles } from "lucide-react";
import { setContent } from "../../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";

function UploadImage({ index, placeholder = "Click to upload an image" }) {
  const dispatch = useDispatch();

  const oldImage = useSelector(
    (state) => state?.blog?.blog?.content[index]?.data
  );

  const [preview, setPreview] = useState(oldImage || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (oldImage) {
      setPreview(oldImage);
    } else {
      setPreview(null);
    }
  }, [oldImage]);

  const handleFileChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);

    // Simulate upload delay for better UX
    setTimeout(() => {
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
      dispatch(setContent({ index, type: "image", data: fileURL }));
      setIsUploading(false);
    }, 800);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setIsUploading(true);
        setFileName(file.name);

        setTimeout(() => {
          const fileURL = URL.createObjectURL(file);
          setPreview(fileURL);
          dispatch(setContent({ index, type: "image", data: fileURL }));
          setIsUploading(false);
        }, 800);
      }
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName("");
    dispatch(setContent({ index, type: "image", data: null }));
  };

  useEffect(() => {
    let fileURL = null;
    if (preview) {
      fileURL = preview;
    }
    dispatch(setContent({ index, type: "image", data: fileURL }));
  }, [index]);

  return (
    <div className="relative group">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-200 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-200 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
      </div>

      {/* Main upload container */}
      <div
        className={`relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 
                      overflow-hidden transition-all duration-500 ease-out
                      ${
                        isDragOver
                          ? "scale-105 shadow-3xl bg-white/90 border-purple-300"
                          : "hover:shadow-3xl hover:bg-white/85"
                      }
                      ${preview ? "min-h-96" : "min-h-48"}`}
      >
        {/* Gradient border effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 
                        opacity-0 transition-opacity duration-500 
                        ${
                          isDragOver ? "opacity-100" : "group-hover:opacity-30"
                        }`}
        ></div>

        <label
          className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer p-8"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />

          {isUploading ? (
            /* Loading state */
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Uploading...
                </p>
                <p className="text-sm text-gray-500 mt-1">{fileName}</p>
              </div>
            </div>
          ) : preview ? (
            /* Image preview */
            <div className="relative w-full h-full group/image">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full max-h-96 object-cover rounded-2xl shadow-lg"
              />

              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                <div className="flex space-x-4">
                  <button
                    onClick={handleRemoveImage}
                    className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl shadow-lg">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Success indicator */}
              <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
          ) : (
            /* Upload prompt */
            <div className="flex flex-col items-center space-y-6 text-center">
              {/* Animated upload icon */}
              <div
                className={`relative p-6 rounded-3xl transition-all duration-300
                              ${
                                isDragOver
                                  ? "bg-gradient-to-r from-purple-600 to-blue-600 scale-110"
                                  : "bg-gradient-to-r from-gray-400 to-gray-500 group-hover:from-purple-500 group-hover:to-blue-500"
                              }`}
              >
                <ImageIcon className="w-8 h-8 text-white" />

                {/* Plus icon overlay */}
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg">
                  <Plus className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              {/* Upload text */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {isDragOver ? "Drop your image here" : "Upload Image"}
                </h3>
                <p className="text-gray-600 font-medium">{placeholder}</p>
                <p className="text-sm text-gray-500">
                  {isDragOver
                    ? "Release to upload"
                    : "Drag & drop or click to browse"}
                </p>
              </div>

              {/* Supported formats */}
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span className="px-2 py-1 bg-gray-100 rounded-lg">JPG</span>
                <span className="px-2 py-1 bg-gray-100 rounded-lg">PNG</span>
                <span className="px-2 py-1 bg-gray-100 rounded-lg">GIF</span>
                <span className="px-2 py-1 bg-gray-100 rounded-lg">WEBP</span>
              </div>
            </div>
          )}

          {/* Dashed border animation */}
          <div
            className={`absolute inset-4 border-2 border-dashed rounded-2xl pointer-events-none
                          transition-all duration-300
                          ${
                            isDragOver
                              ? "border-purple-400 animate-pulse"
                              : preview
                              ? "border-transparent"
                              : "border-gray-300 group-hover:border-purple-300"
                          }`}
          ></div>
        </label>

        {/* Floating shine effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                        -skew-x-12 transition-transform duration-1000
                        ${
                          isDragOver ? "translate-x-full" : "-translate-x-full"
                        }`}
        ></div>
      </div>

      {/* Focus ring */}
      <div
        className={`absolute inset-0 rounded-3xl border-4 border-purple-500/30 
                      transition-all duration-300 pointer-events-none
                      ${
                        isDragOver
                          ? "opacity-100 scale-105"
                          : "opacity-0 scale-100"
                      }`}
      ></div>
    </div>
  );
}

export default UploadImage;
