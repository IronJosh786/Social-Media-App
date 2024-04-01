import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getLikedPosts,
  isDocumentLiked,
  toggleCommentLike,
  togglePostLike,
} from "../controllers/like.controller.js";

const router = Router();

router.route("/is-document-liked/:documentId").get(verifyJWT, isDocumentLiked);
router.route("/toggle-post-like/:postId").post(verifyJWT, togglePostLike);
router
  .route("/toggle-comment-like/:commentId")
  .post(verifyJWT, toggleCommentLike);
router.route("/get-liked-posts").get(verifyJWT, getLikedPosts);

export default router;
