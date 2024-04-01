import mongoose, { isValidObjectId } from "mongoose";
import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { z } from "zod";

const captionData = z
  .string()
  .min(10, { message: "Atleast 10 characters are required" })
  .max(200, { message: "Maximum of 200 characters are allowed" });

const getAllPost = asyncHandler(async (req, res) => {
  const allPosts = await Post.aggregate([
    {
      $project: {
        _id: 1,
      },
    },
  ]);

  return res.status(200).json({ message: "Fetched all posts", data: allPosts });
});

const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  const post = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
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

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  return res
    .status(200)
    .json({ message: "Fetched the post details", data: post });
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
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Could not create the post" });
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

  const deletedPost = await Post.findByIdAndDelete(
    new mongoose.Types.ObjectId(postId)
  );

  if (!deletedPost) {
    return res.status(404).json({ message: "Post not found" });
  }

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
};
