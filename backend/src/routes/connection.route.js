import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  acceptRequest,
  declineRequest,
  getFollowers,
  getFollowing,
  getPendingRequests,
  isFollowing,
  sendRequest,
} from "../controllers/connection.controller.js";

const router = Router();

router.route("/send-request/:userId").post(verifyJWT, sendRequest);
router.route("/accept-request/:requestId").patch(verifyJWT, acceptRequest);
router.route("/decline-request/:requestId").delete(verifyJWT, declineRequest);
router.route("/get-followers").get(verifyJWT, getFollowers);
router.route("/get-following").get(verifyJWT, getFollowing);
router.route("/get-pending-requests").get(verifyJWT, getPendingRequests);
router.route("/get-is-following/:userId").get(verifyJWT, isFollowing);

export default router;
