import multer from "multer";

//* Multer middleware for file upload which will store the file in the temp folder
const storage = multer.diskStorage({

  // Destination of the file
  destination: (req, file, cb) => {
    cb(null, "./public/temp");
  },

  // File name
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },  
});

export const upload = multer({ storage: storage });
