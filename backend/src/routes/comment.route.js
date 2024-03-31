import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getPostComments,
  addComment,
  deleteComment,
  editComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/get-post-comments/:postId").get(getPostComments);
router.route("/add-comment/:postId").post(verifyJWT, addComment);
router.route("/edit-comment/:commentId").patch(verifyJWT, editComment);
router.route("/delete-comment/:commentId").delete(verifyJWT, deleteComment);
export default router;
