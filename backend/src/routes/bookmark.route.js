import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  isBookmarked,
  getAllBookmarks,
  toggleBookmark,
} from "../controllers/bookmark.controller.js";

const router = Router();

router.route("/is-bookmarked/:postId").get(verifyJWT, isBookmarked);
router.route("/get-all-bookmarks").get(verifyJWT, getAllBookmarks);
router.route("/toggle-bookmark/:postId").post(verifyJWT, toggleBookmark);

export default router;
