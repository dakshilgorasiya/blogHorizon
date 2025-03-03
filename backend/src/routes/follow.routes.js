import { Router } from "express";
import {
  toggleFollowUser,
  getFollowers,
  getFollowing,
  checkFollow,
} from "../controllers/follow.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/toggle-follow").post(verifyAccessToken, toggleFollowUser);

export default router;
