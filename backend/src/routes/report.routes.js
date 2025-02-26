import { Router } from "express";
import {
  verifyAccessToken,
  verifyAdmin,
} from "../middlewares/auth.middleware.js";
import { createReport } from "../controllers/report.controller.js";

const router = Router();

router.route("/create-report").post(verifyAccessToken, createReport);

export default router;
