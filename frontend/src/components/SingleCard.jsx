import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { base } from "../baseUrl.js";
import { toast } from "sonner";
import axios from "../axios.js";

function SingleCard({ postId }) {
  const [post, setPost] = useState({
    _id: "",
    avatar: "",
    username: "",
    images: [],
    caption: "",
    totalLikeCount: 0,
    commentsOnPost: [],
    postedBy: "",
  });
  const [isLiked, setIsLiked] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { darkMode } = useSelector((state) => state.theme);

  const getBackgroundImageStyle = () => {
    const strokeColor = darkMode
      ? "rgb(255 255 255 / 0.2)"
      : "rgb(0 0 0 / 0.2)";
    return {
      backgroundImage: `url('data:image/svg+xml,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22 width=%228%22 height=%228%22 fill=%22none%22 stroke=%22${strokeColor}%22%3e%3cpath d=%22M0%20.5H31.5V32%22/%3e%3c/svg%3e')`,
    };
  };

  const toggleLike = async (id) => {
    try {
      const response = await axios.post(
        `${base}/api/v1/like/toggle-post-like/${id}`
      );
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      fetchPost(id);
    }
  };

  const handleLikeClick = () => {
    if (!isLoggedIn) {
      toast.error("Login Required");
      return;
    }
    const flag = !isLiked;
    const newCount = flag ? post.totalLikeCount + 1 : post.totalLikeCount - 1;
    setPost({ ...post, totalLikeCount: newCount });
    setIsLiked(flag);
    toggleLike(postId);
  };

  const fetchPost = async (id) => {
    try {
      const response = await axios.get(`${base}/api/v1/post/get-post/${id}`);
      const { _id, images, caption, totalLikeCount, commentsOnPost, postedBy } =
        response.data.data;
      const { avatar, username } = response.data.data.ownerDetails[0];
      setPost({
        _id,
        avatar,
        username,
        caption,
        images,
        totalLikeCount,
        commentsOnPost,
        postedBy,
      });
      if (isLoggedIn) {
        const res = await axios.get(
          `${base}/api/v1/like/is-document-liked/${id}`
        );
        setIsLiked(res.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchPost(postId);
  }, []);

  return (
    <div
      className={`p-4 flex flex-col gap-4 border-y ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <div className="flex gap-4 items-center">
        <div>
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={post.avatar}
            alt="avatar"
          />
        </div>
        <p
          onClick={() => navigate(`/user-profile/${post.postedBy}`)}
          className="font-bold hover:cursor-pointer"
        >
          {post.username}
        </p>
      </div>
      <div
        style={getBackgroundImageStyle()}
        className="border border-base-300 max-w-full max-h-[300px] sm:max-h-[450px] carousel rounded-box"
      >
        {post.images.map((path) => {
          const parts = path.split("/");
          const uniqueKey = parts[parts.length - 1].split(".")[0];
          return (
            <div key={uniqueKey} className="carousel-item w-full">
              <img
                src={path}
                className="w-full h-full object-contain"
                alt="post image"
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center">
        <div
          className={`flex gap-4 items-center ${isLiked ? "block" : "hidden"}`}
        >
          <button
            onClick={handleLikeClick}
            className="h-6 w-6 active:scale-90 transition all ease-in-out duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fill="red"
                d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z"
              ></path>
            </svg>
          </button>{" "}
          <span className="font-bold">
            {post.totalLikeCount}
            <span className="font-normal"> Likes</span>
          </span>
        </div>
        <div
          className={`flex gap-4 items-center ${isLiked ? "hidden" : "block"}`}
        >
          <button
            onClick={handleLikeClick}
            className="h-6 w-6 active:scale-90 transition all ease-in-out duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`${
                isLiked ? "hidden" : "block"
              } hover:fill-red-600 transition all ease-in-out duration-150`}
            >
              <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z"></path>
            </svg>
          </button>{" "}
          <span className="font-bold">
            {post.totalLikeCount}
            <span className="font-normal"> Likes</span>
          </span>
        </div>
        <button
          className="h-6 w-6 active:scale-90 transition all ease-in-out duration-200 hover:cursor-pointer"
          onClick={() => navigate(`/detailedPost/${post._id}`)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="hover:fill-blue-600"
          >
            <path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM5.76282 17H20V5H4V18.3851L5.76282 17ZM11 10H13V12H11V10ZM7 10H9V12H7V10ZM15 10H17V12H15V10Z"></path>
          </svg>
        </button>
      </div>
      <p>
        <span
          onClick={() => {
            navigate(`/user-profile/${post.postedBy}`);
          }}
          className="font-bold underline underline-offset-2 hover:cursor-pointer"
        >
          {post.username}
        </span>{" "}
        {post.caption}
      </p>
    </div>
  );
}

export default SingleCard;
