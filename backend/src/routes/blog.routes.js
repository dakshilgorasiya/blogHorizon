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
  getBlogByCategory,
} from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  verifyAccessToken,
  checkUserLoggedIn,
} from "../middlewares/auth.middleware.js";

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

router.route("/get-all-blogs").get(checkUserLoggedIn, getAllBlogs);

router.route("/get-blog-by-id/:id").get(checkUserLoggedIn, getBlogById);

// router.route("/getBlogOfUser").get(verifyJWT, getBlogOfUser);

router.route("/update-blog/:blogId").put(
  verifyAccessToken,
  upload.fields([
    {
      name: "updatedImages",
    },
  ]),
  updateBlog
);

router.route("/delete-blog/:blogId").delete(verifyAccessToken, deleteBlog);

// router.route("/getFavoriteBlogs").get(verifyJWT, getFavoriteBlogs);

// router.route("/getHistoryBlogs").get(verifyJWT, getHistoryBlogs);

router.route("/getInterests").get(getInterests);

router.route("/get-blog-by-category").get(checkUserLoggedIn, getBlogByCategory);

export default router;
