import { Router } from "express";
import { handleUploadError, upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPost,
  editPost,
  deletePost,
  togglePublishedStatus,
  getPostById,
  getAllPost,
  getPostsOfFollowing,
} from "../controllers/post.controller.js";

const router = Router();

router
  .route("/new-post")
  .post(verifyJWT, upload.array("photos", 5), handleUploadError, createPost);

router.route("/edit-post/:postId").patch(verifyJWT, editPost);
router.route("/delete-post/:postId").delete(verifyJWT, deletePost);
router.route("/toggle-status/:postId").patch(verifyJWT, togglePublishedStatus);
router.route("/get-all-posts").get(getAllPost);
router.route("/get-followings-post").get(verifyJWT, getPostsOfFollowing);
router.route("/get-post/:postId").get(getPostById);

export default router;
