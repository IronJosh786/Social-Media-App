import { Router } from "express";
import { handleUploadError, upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  editProfile,
  editAvatar,
  editCoverImage,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/edit-profile").patch(verifyJWT, editProfile);
router
  .route("/edit-avatar")
  .patch(verifyJWT, upload.single("avatar"), handleUploadError, editAvatar);
router
  .route("/edit-cover-image")
  .patch(
    verifyJWT,
    upload.single("coverImage"),
    handleUploadError,
    editCoverImage
  );
router.route("/get-user-profile").get(verifyJWT, getUserProfile);

export default router;
