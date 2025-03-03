import { Router } from "express";
import {
  toggleLike,
  getLikes,
  checkLike,
} from "../controllers/like.controller.js";
import {
  verifyAccessToken,
  checkUserLoggedIn,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/toggle-like").post(verifyAccessToken, toggleLike);

router.route("/get-likes").get(checkUserLoggedIn, getLikes);

export default router;
