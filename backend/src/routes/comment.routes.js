import { Router } from "express";
import {
  postComment,
  getAllComments,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/postComment").post(verifyJWT, postComment);

router.route("/getAllComments").get(verifyJWT, getAllComments);

export default router;
