import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Connection } from "../models/connection.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { z } from "zod";

const registerData = z.object({
  fullName: z
    .string()
    .min(6, { message: "Full Name must be at least 6 characters" }),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .regex(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      ),
      {
        message:
          "Password must include at least one lowercase letter, one uppercase letter, one number, one symbol, and be at least 8 characters long",
      }
    ),
});

const loginData = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .regex(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      ),
      {
        message:
          "Password must include at least one lowercase letter, one uppercase letter, one number, one symbol, and be at least 8 characters long",
      }
    ),
});

const editData = z.object({
  fullName: z
    .string()
    .min(6, { message: "Full Name must be at least 6 characters" })
    .optional(),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" })
    .optional(),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  currentPassword: z
    .string()
    .regex(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      ),
      {
        message:
          "Password must include at least one lowercase letter, one uppercase letter, one number, one symbol, and be at least 8 characters long",
      }
    )
    .optional(),
  newPassword: z
    .string()
    .regex(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      ),
      {
        message:
          "Password must include at least one lowercase letter, one uppercase letter, one number, one symbol, and be at least 8 characters long",
      }
    )
    .optional(),
  bio: z
    .string()
    .max(100, { message: "Less than 100 characters allowed" })
    .optional(),
});

const generateAccessAndRefreshToken = async (id) => {
  const user = await User.findById(id);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { error, success } = registerData.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: error.errors[0].message });
  }

  const { fullName, username, email, password } = req.body;

  const isPresent = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isPresent) {
    return res.status(400).json({ message: "Username/Email already taken" });
  }

  const newUser = await User.create({
    fullName,
    username,
    email,
    password,
    avatar:
      "http://res.cloudinary.com/drkm6sltd/image/upload/v1711790632/fkoaiin4tgugaelo8a3k.webp",
    coverImage:
      "http://res.cloudinary.com/drkm6sltd/image/upload/v1711790990/grp1ioxfqaisebq0kdnq.jpg",
    bio: "This is system generated bio",
  });

  if (!newUser) {
    return res.status(500).json({ message: "Could not create the user" });
  }

  const user = await User.findById(newUser._id).select(
    "-password -refreshToken -userPosts"
  );

  return res.status(201).json({
    message: "User created",
    data: user,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { error, success } = loginData.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: error.errors[0].message });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res.status(200).json({
    message: "User logged in",
    data: { ...loggedInUser.toObject(), accessToken },
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  return res.status(200).json({ message: "User logged out" });
});

const editProfile = asyncHandler(async (req, res) => {
  const { error, success } = editData.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: error.errors[0].message });
  }

  const { fullName, username, email, currentPassword, newPassword, bio } =
    req.body;

  const atLeastOneFilled = [fullName, username, email, bio].some(
    (field) => !!field
  );
  const passwordChange = !!currentPassword && !!newPassword;

  if (!atLeastOneFilled && !passwordChange) {
    return res.status(400).json({
      message:
        "At least one field is required for profile update or provide both current and new password for password change.",
    });
  }

  const user = await User.findById(req.user?._id);

  if (atLeastOneFilled) {
    if (fullName) user.fullName = fullName;
    if (bio) user.bio = bio;
    if (email) {
      const isPresent = await User.findOne({ email });
      if (isPresent) {
        return res.status(400).json({ message: "Email already taken" });
      }
      user.email = email;
    }
    if (username) {
      const isPresent = await User.findOne({ username });
      if (isPresent) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = username;
    }
  }

  if (passwordChange) {
    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect old password" });
    }
    user.password = newPassword;
  }

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken -userPosts"
  );

  return res
    .status(200)
    .json({ message: "User details updated", data: updatedUser });
});

const editAvatar = asyncHandler(async (req, res) => {
  const localPath = req.file?.path;
  if (!localPath) {
    return res.status(400).json({ message: "Image is required" });
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const avatar = await uploadOnCloudinary(localPath);
  if (!avatar) {
    return res.status(400).json({ message: "Could not update image" });
  }

  user.avatar = avatar.url;
  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken -userPosts"
  );

  return res.status(200).json({ message: "Avatar updated", data: updatedUser });
});

const editCoverImage = asyncHandler(async (req, res) => {
  const localPath = req.file?.path;
  if (!localPath) {
    return res.status(400).json({ message: "Image is required" });
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const coverImage = await uploadOnCloudinary(localPath);
  if (!coverImage) {
    return res.status(400).json({ message: "Could not update image" });
  }

  user.coverImage = coverImage.url;
  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken -userPosts"
  );

  return res
    .status(200)
    .json({ message: "Cover Image updated", data: updatedUser });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const id = req.user?._id;
  const posts = await Post.aggregate([
    {
      $match: {
        postedBy: id,
      },
    },
    {
      $project: {
        _id: 1,
        images: 1,
        updatedAt: 1,
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
  ]);

  const followings = await Connection.find({
    from: req.user?._id,
    status: "accepted",
  });

  const followers = await Connection.find({
    to: req.user?._id,
    status: "accepted",
  });

  const { fullName, email, username, bio, coverImage, avatar } = req.user;

  return res.status(200).json({
    message: "Fetched user profile",
    data: {
      fullName,
      email,
      username,
      bio,
      coverImage,
      avatar,
      posts,
      followers,
      followings,
    },
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find()
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  return res.status(200).json({ message: "Fetched all users", data: allUsers });
});

const searchResult = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const users = await User.find({
    $or: [
      { username: { $regex: query, $options: "i" } },
      { fullName: { $regex: query, $options: "i" } },
    ],
  }).select("username fullName avatar bio");

  const posts = await Post.aggregate([
    {
      $match: {
        caption: { $regex: query, $options: "i" },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likesOnPost",
      },
    },
    {
      $addFields: {
        totalLikes: {
          $size: "$likesOnPost",
        },
      },
    },
    {
      $project: {
        likesOnPost: 0,
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
              avatar: 1,
              fullName: 1,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$ownerDetails",
    },
  ]);

  return res.status(200).json({
    message: "Fetched search results",
    data: { users: users, posts: posts },
  });
});

const getPublicProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const user = await User.findById(id).select(
    "username fullName bio avatar coverImage"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const posts = await Post.aggregate([
    {
      $match: {
        postedBy: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $project: {
        _id: 1,
        images: 1,
        updatedAt: 1,
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
  ]);

  return res.status(200).json({
    message: "Fetched user profile",
    data: { info: user, posts: posts },
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  editProfile,
  editAvatar,
  editCoverImage,
  getUserProfile,
  getAllUsers,
  searchResult,
  getPublicProfile,
};
