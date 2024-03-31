import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";

const togglePostLike = asyncHandler(async (req, res) => {});

const toggleCommentLike = asyncHandler(async (req, res) => {});

const getLikedPosts = asyncHandler(async (req, res) => {});

export { togglePostLike, toggleCommentLike, getLikedPosts };
