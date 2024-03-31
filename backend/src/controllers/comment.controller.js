import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";

const getPostComments = asyncHandler(async (req, res) => {});

const addComment = asyncHandler(async (req, res) => {});

const editComment = asyncHandler(async (req, res) => {});

const deleteComment = asyncHandler(async (req, res) => {});

export { getPostComments, addComment, editComment, deleteComment };
