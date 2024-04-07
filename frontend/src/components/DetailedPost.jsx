import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { base } from "../baseUrl.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "../App.css";

function DetailedPost() {
  const { id } = useParams();
  const { darkMode } = useSelector((state) => state.theme);
  const { isLoggedIn } = useSelector((state) => state.user);

  const [post, setPost] = useState({
    images: [],
    caption: "",
    totalLikeCount: 0,
    commentsOnPost: [],
    avatar: "",
    username: "",
    isOwner: false,
  });

  const [isLiked, setIsLiked] = useState(false);

  const fetchPostDetails = async (id) => {
    try {
      const response = await axios.get(`${base}/api/v1/post/get-post/${id}`);
      const { images, caption, totalLikeCount, commentsOnPost, isOwner } =
        response.data.data;
      const { avatar, username } = response.data.data.ownerDetails[0];
      setPost({
        images,
        caption,
        totalLikeCount,
        commentsOnPost,
        avatar,
        username,
        isOwner,
      });

      if (isLoggedIn) {
        try {
          const res = await axios.get(
            `${base}/api/v1/like/is-document-liked/${id}`
          );
          setIsLiked(res.data.data);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchPostDetails(id);
  }, []);

  const toggleLike = async (id) => {
    if (!isLoggedIn) {
      toast.error("Login Required");
      return;
    }
    try {
      const response = await axios.post(
        `${base}/api/v1/like/toggle-post-like/${id}`
      );
      await fetchPostDetails(id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b pb-4 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <div>
            <img
              className="h-10 w-10 rounded-full"
              src={post.avatar}
              alt="avatar"
            />
          </div>
          <div>{post.username}</div>
        </div>
        {post.images.map((image, index) => (
          <div key={index}>
            <img className="h-20 w-20" src={image} alt="image" />
          </div>
        ))}
        <p>{post.caption}</p>
        <p>{post.totalLikeCount}</p>
        {post.commentsOnPost.map((comment, index) => (
          <div key={index}>
            <p>{comment.content}</p>
          </div>
        ))}
        {post.isOwner && <p>Owner</p>}
        <button
          onClick={() => {
            toggleLike(id);
          }}
          className="h-8 w-8 active:scale-90 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fill={isLiked ? "red" : "currentColor"}
              d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default DetailedPost;
