import { Router } from "express";
import {
  toggleFollowUser,
  getFollowers,
  getFollowing,
  checkFollow,
} from "../controllers/follow.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/toggle-follow").post(verifyJWT, toggleFollowUser);

router.route("/followers").get(verifyJWT, getFollowers);

router.route("/following").get(verifyJWT, getFollowing);

router.route("/check-follow").get(verifyJWT, checkFollow);

export default router;