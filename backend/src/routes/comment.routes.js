import { Router } from "express";
import {
  postComment,
  getAllComments,
} from "../controllers/comment.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/postComment").post(verifyAccessToken, postComment);

router.route("/getAllComments").get(getAllComments);

export default router;
