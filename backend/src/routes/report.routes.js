import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import {
  createReport,
  getReports,
  markReportAsResolved,
} from "../controllers/report.controller.js";

const router = Router();

// router.route("/createReport").post(verifyJWT, createReport);

// router.route("/getReports").get(verifyJWT, getReports);

// router.route("/markReportAsResolved").post(verifyJWT, markReportAsResolved);

export default router;