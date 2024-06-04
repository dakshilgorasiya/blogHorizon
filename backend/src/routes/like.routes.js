import { Router } from "express";
import {
  toggleLike,
  getLikes,
  checkLike,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/toggleLike").post(verifyJWT, toggleLike);

router.route("/getLikes").get(verifyJWT, getLikes);

router.route("/checkLike").get(verifyJWT, checkLike);

export default router;