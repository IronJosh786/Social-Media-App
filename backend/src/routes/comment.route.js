import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addComment,
  deleteComment,
  editComment,
  getCommentLikeCount,
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/add-comment/:postId").post(verifyJWT, addComment);
router.route("/edit-comment/:commentId").patch(verifyJWT, editComment);
router.route("/delete-comment/:commentId").delete(verifyJWT, deleteComment);
router.route("/get-comments-like/:commentId").get(getCommentLikeCount);
export default router;
