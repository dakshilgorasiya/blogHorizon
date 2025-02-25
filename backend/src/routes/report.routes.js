import { Router } from "express";
import {
  verifyAccessToken,
  verifyAdmin,
} from "../middlewares/auth.middleware.js";
import {
  createReport,
  getReports,
  markReportAsResolved,
} from "../controllers/report.controller.js";

const router = Router();

router.route("/create-report").post(verifyAccessToken, createReport);

router.route("/get-reports").get(verifyAccessToken, verifyAdmin, getReports);

router
  .route("/mark-report-as-resolved")
  .patch(verifyAccessToken, verifyAdmin, markReportAsResolved);

export default router;
