import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getLikedPosts,
  toggleCommentLike,
  togglePostLike,
} from "../controllers/like.controller.js";

const router = Router();

router.route("/toggle-post-like/:postId").post(verifyJWT, togglePostLike);
router
  .route("/toggle-comment-like/:commentId")
  .post(verifyJWT, toggleCommentLike);
router.route("/get-liked-posts").get(verifyJWT, getLikedPosts);

export default router;
