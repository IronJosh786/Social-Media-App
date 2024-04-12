import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Connection } from "../models/connection.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendRequest = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user._id.equals(req.user?._id)) {
    return res.status(400).json({ message: "Cannot send to self" });
  }

  const connectionExists = await Connection.findOne({
    from: req.user?._id,
    to: userId,
  });

  if (connectionExists) {
    return res.status(400).json({ message: "Connection already exists" });
  }

  const connection = await Connection.create({
    from: req.user?._id,
    to: userId,
  });

  return res
    .status(201)
    .json({ message: "Connection request sent", data: connection });
});

const acceptRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  if (!isValidObjectId(requestId)) {
    return res.status(400).json({ message: "Invalid request id" });
  }

  const request = await Connection.findById(requestId);
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (!req.user?._id.equals(request.to)) {
    return res.status(404).json({ message: "Only the owner can accept" });
  }

  request.status = "accepted";
  await request.save({ validateBeforeSave: false });

  const acceptedRequest = await Connection.findById(requestId);

  return res
    .status(200)
    .json({ message: "Accepted the request", data: acceptedRequest });
});

const declineRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  if (!isValidObjectId(requestId)) {
    return res.status(400).json({ message: "Invalid request id" });
  }

  const request = await Connection.findById(requestId);
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  // if (!req.user?._id.equals(request.to)) {
  //   return res.status(404).json({ message: "Only the owner can decline" });
  // }

  const declinedRequest = await Connection.findByIdAndDelete(requestId);

  if (!declinedRequest) {
    return res.status(500).json({ message: "Could not decline the request" });
  }

  return res
    .status(200)
    .json({ message: "Declined the request", data: declinedRequest });
});

const getFollowers = asyncHandler(async (req, res) => {
  const followers = await Connection.aggregate([
    {
      $match: {
        to: req.user?._id,
        status: "accepted",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "from",
        foreignField: "_id",
        as: "followerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ]);

  if (!followers.length) {
    return res.status(200).json({ message: "No followers" });
  }

  return res
    .status(200)
    .json({ message: "Fetched followers", data: followers });
});

const getFollowing = asyncHandler(async (req, res) => {
  const following = await Connection.aggregate([
    {
      $match: {
        from: req.user?._id,
        status: "accepted",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "to",
        foreignField: "_id",
        as: "followingDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ]);

  if (!following.length) {
    return res.status(200).json({ message: "No followings" });
  }

  return res
    .status(200)
    .json({ message: "Fetched followings", data: following });
});

const getPendingRequests = asyncHandler(async (req, res) => {
  const pendingRequests = await Connection.aggregate([
    {
      $match: {
        to: req.user._id,
        status: "pending",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "from",
        foreignField: "_id",
        as: "requestorDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  if (!pendingRequests.length) {
    return res.status(200).json({ message: "No pending requests" });
  }

  return res
    .status(200)
    .json({ message: "Fetched pending requests", data: pendingRequests });
});

const isFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const followingStatus = await Connection.findOne({
    from: req.user?._id,
    to: userId,
    status: "accepted",
  });

  if (!followingStatus) {
    return res.status(200).json({ message: "Not following", data: false });
  }

  return res.status(200).json({ message: "Following", data: true });
});

const connectionStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const status = await Connection.findOne({
    from: req.user?._id,
    to: userId,
  });

  if (!status) {
    return res.status(200).json({ message: "Connection request not found" });
  }

  return res
    .status(200)
    .json({ message: "Fetched connection status", data: status });
});

export {
  sendRequest,
  acceptRequest,
  declineRequest,
  getFollowers,
  getFollowing,
  getPendingRequests,
  isFollowing,
  connectionStatus,
};
