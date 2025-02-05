import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  makeBlogFavorite,
  updateAvatar,
  updateBio,
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

// secure route
// router.route("/logout").post(verifyJWT, logoutUser);

// router.route("/current-user").get(verifyJWT, getCurrentUser);

// router.route("/update-avatar").patch(
//   verifyJWT,
//   upload.fields([
//     {
//       name: "avatar",
//       maxCount: 1,
//     },
//   ]),
//   updateAvatar
// );

// router.route("/update-bio").post(verifyJWT, updateBio);

// router.route("/makeBlogFavorite").post(verifyJWT, makeBlogFavorite);

export default router;
