import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import {
  createReport,
  getReports,
  markReportAsResolved,
} from "../controllers/report.controller.js";

const router = Router();

router.route("/create-report").post(verifyAccessToken, createReport);

router.route("/get-reports").get(verifyAccessToken, getReports);

router
  .route("/mark-report-as-resolved")
  .patch(verifyAccessToken, markReportAsResolved);

export default router;
