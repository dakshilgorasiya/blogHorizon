import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogOfUser,
  updateBlog,
  deleteBlog,
  getFavoriteBlogs,
  getHistoryBlogs,
  getInterests,
} from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-blog").post(
  verifyAccessToken,
  upload.fields([
    {
      name: "images",
    },
  ]),
  createBlog
);

router.route("/get-all-blogs").get(getAllBlogs);

router.route("/get-blog-by-id/:id").get(getBlogById);

// router.route("/getBlogOfUser").get(verifyJWT, getBlogOfUser);

// router.route("/updateBlog").put(
//   verifyJWT,
//   upload.fields([
//     {
//       name: "thumbnail",
//       maxCount: 1,
//     },
//     {
//       name: "photos",
//       maxCount: 10,
//     },
//   ]),
//   updateBlog
// );

// router.route("/deleteBlog").delete(verifyJWT, deleteBlog);

// router.route("/getFavoriteBlogs").get(verifyJWT, getFavoriteBlogs);

// router.route("/getHistoryBlogs").get(verifyJWT, getHistoryBlogs);

router.route("/getInterests").get(getInterests);

export default router;
