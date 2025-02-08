import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  makeBlogFavorite,
  updateAvatar,
  updateBio,
  renewAccessToken,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/renew-access-token").post(renewAccessToken);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password/:resetToken").post(resetPassword);

router.route("/logout").post(logoutUser);
// secure route

router.route("/current-user").get(verifyAccessToken, getCurrentUser);

router.route("/update-avatar").patch(
  verifyAccessToken,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  updateAvatar
);

router.route("/update-bio").post(verifyAccessToken, updateBio);

router.route("/makeBlogFavorite").post(verifyAccessToken, makeBlogFavorite);

export default router;
