import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogOfUser,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createBlog").post(
  verifyJWT,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "photos",
      maxCount: 10,
    },
  ]),
  createBlog
);

export default router;
