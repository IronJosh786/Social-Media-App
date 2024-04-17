import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { z } from "zod";

const commentData = z
  .string()
  .min(1, { message: "Minimum of 1 character is required" })
  .max(100, { message: "Maximum of 100 characters are allowed" });

const getCommentLikeCount = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    return res.status(400).json({ message: "Invalid comment id" });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
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

  if (comment.commentedBy.equals(requestorId)) {
    isOwner = true;
  }

  const likes = await Like.find({
    comment: commentId,
  });

  return res.status(200).json({
    message: "Fetched like count",
    data: {
      commentDetails: comment,
      likeCount: likes.length,
      isOwner: isOwner,
    },
  });
});

const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  const { error, success } = commentData.safeParse(req.body.content);
  if (!success) {
    return res.status(400).json({ message: error.errors[0].message });
  }

  const { content } = req.body;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comment = await Comment.create({
    post: postId,
    content: content,
    commentedBy: req.user?._id,
  });

  if (!comment) {
    return res.status(500).json({ message: "Could not comment on post" });
  }

  return res.status(201).json({ message: "Commented on post", data: comment });
});

const editComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    return res.status(400).json({ message: "Invalid comment id" });
  }

  const { error, success } = commentData.safeParse(req.body.content);
  if (!success) {
    return res.status(400).json({ message: error.errors[0].message });
  }

  const { content } = req.body;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (!req.user?.isAdmin) {
    if (!comment.commentedBy.equals(req.user?._id)) {
      return res
        .status(400)
        .json({ message: "Only owner can update the comment" });
    }
  }

  comment.content = content;
  await comment.save({ validateBeforeSave: false });

  const updatedComment = await Comment.findById(comment._id);

  return res
    .status(200)
    .json({ message: "Edited the comment", data: updatedComment });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    return res.status(400).json({ message: "Invalid comment id" });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (!req.user?.isAdmin) {
    if (!comment.commentedBy.equals(req.user?._id)) {
      return res
        .status(400)
        .json({ message: "Only owner can delete the comment" });
    }
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    return res.status(404).json({ message: "Could not find the comment" });
  }

  return res
    .status(200)
    .json({ message: "Deleted the comment", data: deletedComment });
});

export { addComment, editComment, deleteComment, getCommentLikeCount };
