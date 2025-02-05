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
} from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const router = Router();

// router.route("/createBlog").post(
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
//   createBlog
// );

// router.route("/getAllBlogs").get(verifyJWT, getAllBlogs);

// router.route("/getBlogById/:id").get(verifyJWT, getBlogById);

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

export default router;
