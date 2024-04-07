import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Connection } from "../models/connection.model.js";
import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteImagesFromCloudinary,
} from "../utils/cloudinary.js";
import { z } from "zod";
import jwt from "jsonwebtoken";

const captionData = z
  .string()
  .min(10, { message: "Atleast 10 characters are required" })
  .max(200, { message: "Maximum of 200 characters are allowed" });

const getAllPost = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  if (page < 1) {
    page = 1;
  }
  if (limit < 1) {
    limit = 10;
  }

  const start = (page - 1) * limit;

  const allPosts = await Post.aggregate([
    {
      $project: {
        _id: 1,
        postedBy: 1,
        updatedAt: 1,
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
    {
      $skip: start,
    },
    {
      $limit: limit,
    },
  ]);

  return res.status(200).json({ message: "Fetched all posts", data: allPosts });
});

const getPostsOfFollowing = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  if (page < 1) {
    page = 1;
  }
  if (limit < 1) {
    limit = 10;
  }

  const start = (page - 1) * limit;

  const followings = await Connection.find({
    from: req.user?._id,
    status: "accepted",
  });

  const followingsId = followings.map((connection) => connection.to);

  const allPosts = await Post.aggregate([
    {
      $match: {
        postedBy: { $in: followingsId },
      },
    },
    {
      $project: {
        _id: 1,
        postedBy: 1,
        updatedAt: 1,
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
    {
      $skip: start,
    },
    {
      $limit: limit,
    },
  ]);

  return res
    .status(200)
    .json({ message: "Fetched followings post", data: allPosts });
});

const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  let isOwner = false;
  let requestorId = "";

  const token =
    req.cookies?.access_token ||
    req.headers?.authorization?.split(" ")[1] ||
    "";
  if (token) {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-refreshToken -password"
    );

    if (user) {
      requestorId = user._id;
    }
  }

  const isPresent = await Post.findById(postId);
  if (!isPresent) {
    return res.status(404).json("Post not found");
  }

  if (isPresent.postedBy.equals(requestorId)) {
    isOwner = true;
  }

  const post = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likesOnPost",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "likedBy",
              foreignField: "_id",
              as: "likedBy",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    avatar: 1,
                    fullName: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $addFields: {
        totalLikeCount: {
          $size: "$likesOnPost",
        },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "commentsOnPost",
        pipeline: [
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "comment",
              as: "commentsLike",
            },
          },
          {
            $addFields: {
              totalLikesOnComment: {
                $size: "$commentsLike",
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "commentedBy",
              foreignField: "_id",
              as: "commentedBy",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    avatar: 1,
                    fullName: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              commentsLike: 0,
            },
          },
        ],
      },
    },
    {
      $project: {
        likesOnPost: 0,
      },
    },
  ]);

  if (!post.length) {
    return res.status(404).json({ message: "Post not found" });
  }

  return res.status(200).json({
    message: "Fetched the post details",
    data: { ...post[0], isOwner },
  });
});

const createPost = asyncHandler(async (req, res) => {
  const { error, success } = captionData.safeParse(req.body.caption);

  if (!success) {
    return res.status(400).json({ message: error.errors[0].message });
  }

  const { caption } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Atlease one image is required" });
  }

  try {
    let urlArray = [];
    for (let i = 0; i < req.files.length; i++) {
      const image = await uploadOnCloudinary(req.files[i].path);
      urlArray[i] = image.url;
    }

    const newPost = await Post.create({
      images: urlArray,
      caption: caption,
      postedBy: req.user?._id,
    });

    return res.status(201).json({ message: "Post created", data: newPost });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Could not create the post", error });
  }
});

const editPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { error, success } = captionData.safeParse(req.body.caption);

  if (!success) {
    return res.status(400).json({ message: error.errors[0].message });
  }

  const { caption } = req.body;

  if (!isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  const post = await Post.findById(new mongoose.Types.ObjectId(postId));

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!req.user?.isAdmin) {
    if (!post.postedBy.equals(req.user?._id)) {
      return res
        .status(400)
        .json({ message: "Only owner/admin can edit the post" });
    }
  }

  post.caption = caption;
  post.save({ validateBeforeSave: false });

  const updatedPost = await Post.findById(post._id);

  return res
    .status(200)
    .json({ message: "Edited the post", data: updatedPost });
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!req.user?.isAdmin) {
    if (!post.postedBy.equals(req.user?._id)) {
      return res
        .status(400)
        .json({ message: "Only owner/admin can delete the post" });
    }
  }

  const imageArray = post.images;

  const deletedPost = await Post.findByIdAndDelete(
    new mongoose.Types.ObjectId(postId)
  );

  if (!deletedPost) {
    return res.status(404).json({ message: "Post not found" });
  }

  const deleteImagePromises = imageArray.map((imageUrl) => {
    const parts = imageUrl.split("/");
    const publicId = parts[parts.length - 1].split(".")[0];
    deleteImagesFromCloudinary(publicId);
  });

  return res.status(200).json({ message: "Deleted post", data: deletedPost });
});

const togglePublishedStatus = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  const post = await Post.findById(new mongoose.Types.ObjectId(postId));

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  post.isPublished = !post.isPublished;
  await post.save({ validateBeforeSave: false });

  const updatedPost = await Post.findById(post._id);

  return res
    .status(200)
    .json({ message: "Toggled the publish status", data: updatedPost });
});

export {
  getAllPost,
  createPost,
  getPostById,
  editPost,
  deletePost,
  togglePublishedStatus,
  getPostsOfFollowing,
};
