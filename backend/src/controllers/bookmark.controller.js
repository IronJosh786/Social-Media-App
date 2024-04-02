import { isValidObjectId } from "mongoose";
import { Post } from "../models/post.model.js";
import { Bookmark } from "../models/bookmark.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isBookmarked = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const bookmarked = await Bookmark.findOne({
    post: postId,
    bookmarkedBy: req.user?._id,
  });

  if (!bookmarked) {
    return res
      .status(200)
      .json({ message: "Post is not bookmarked", data: false });
  }

  return res.status(200).json({ message: "Post is bookmarked", data: true });
});

const getAllBookmarks = asyncHandler(async (req, res) => {
  const id = req.user?._id;

  const bookmarks = await Bookmark.aggregate([
    {
      $match: { bookmarkedBy: id },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  if (!bookmarks.length) {
    return res.status(200).json({ message: "No bookmarks" });
  }

  return res.status(200).json({ message: "Fetched bookmarks", bookmarks });
});

const toggleBookmark = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const removedBookmark = await Bookmark.findOneAndDelete({
    post: postId,
    bookmarkedBy: req.user?._id,
  });

  if (removedBookmark) {
    return res
      .status(200)
      .json({ message: "Removed bookmark", data: removedBookmark });
  }

  const newBookmark = await Bookmark.create({
    post: postId,
    bookmarkedBy: req.user?._id,
  });

  return res.status(201).json({ message: "Added bookmark", data: newBookmark });
});

export { isBookmarked, getAllBookmarks, toggleBookmark };
