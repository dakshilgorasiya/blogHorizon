import { Router } from "express";
import {
  getAllReportedBlog,
  getBlogById,
  getReportsByBlogId,
  deleteBlog,
  markReportAsResolved,
  verifyAdmin as verifyAdminController,
  makeAdmin,
} from "../controllers/admin.controller.js";
import {
  verifyAccessToken,
  verifyAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/get-all-reported-blogs")
  .post(verifyAccessToken, verifyAdmin, getAllReportedBlog);

router
  .route("/get-blog-by-id/:id")
  .get(verifyAccessToken, verifyAdmin, getBlogById);

router
  .route("/get-reports-by-blog-id/:id")
  .get(verifyAccessToken, verifyAdmin, getReportsByBlogId);

router.route("/delete-blog").post(verifyAccessToken, verifyAdmin, deleteBlog);

router
  .route("/mark-report-as-resolved/:id")
  .put(verifyAccessToken, verifyAdmin, markReportAsResolved);

router
  .route("/verify-admin")
  .get(verifyAccessToken, verifyAdmin, verifyAdminController);

export default router;
