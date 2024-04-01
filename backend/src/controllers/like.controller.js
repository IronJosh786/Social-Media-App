import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";

const isDocumentLiked = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  if (!isValidObjectId(documentId)) {
    return res.status(400).json({ message: "Invalid document id" });
  }

  const post = await Like.findOne({
    post: documentId,
    likedBy: req.user?._id,
  });

  const comment = await Like.findOne({
    comment: documentId,
    likedBy: req.user?._id,
  });

  if (!post && !comment) {
    return res
      .status(200)
      .json({ message: "Document is not liked", data: false });
  }

  return res.status(200).json({ message: "Document is liked", data: true });
});

const togglePostLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Could not find the post" });
  }

  const removedLike = await Like.findOneAndDelete({
    post: postId,
    likedBy: req.user?._id,
  });

  if (removedLike) {
    return res
      .status(200)
      .json({ message: "Removed like from post", data: removedLike });
  }

  const likedPost = await Like.create({
    post: postId,
    likedBy: req.user?._id,
  });

  if (!likedPost) {
    return res.status(500).json({ message: "Could not like the post" });
  }

  return res.status(201).json({ message: "Liked the post", data: likedPost });
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    return res.status(400).json({ message: "Invalid comment id" });
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(404).json({ message: "Could not find the comment" });
  }

  const removedLike = await Like.findOneAndDelete({
    comment: commentId,
    likedBy: req.user?._id,
  });

  if (removedLike) {
    return res
      .status(200)
      .json({ message: "Removed like from comment", data: removedLike });
  }

  const likedComment = await Like.create({
    comment: new mongoose.Types.ObjectId(commentId),
    likedBy: req.user?._id,
  });

  if (!likedComment) {
    return res.status(500).json({ message: "Could not like the comment" });
  }

  return res
    .status(201)
    .json({ message: "Liked the comment", data: likedComment });
});

const getLikedPosts = asyncHandler(async (req, res) => {
  const id = req.user?._id;

  const likedPosts = await Like.find({
    post: { $exists: true },
    likedBy: id,
  });

  if (!likedPosts.length) {
    return res.status(404).json({ message: "No liked posts by the user" });
  }

  return res
    .status(200)
    .json({ message: "Fetched liked posts", data: likedPosts });
});

export { isDocumentLiked, togglePostLike, toggleCommentLike, getLikedPosts };
