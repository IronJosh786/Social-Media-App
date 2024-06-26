import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    postedBy: "",
  });
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoad, setLikeLoad] = useState(false);
  const [localLoad, setLocalLoad] = useState(false);
  const { posts } = useSelector((state) => state.data);
  const { darkMode } = useSelector((state) => state.theme);
  const { isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();

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
      fetchIsLiked(id);
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

  const fetchIsLiked = async (id) => {
    try {
      const res = await axios.get(
        `${base}/api/v1/like/is-document-liked/${id}`
      );
      setIsLiked(res.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLikeLoad(false);
    }
  };

  const fetchProfilePostData = async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/post/get-post/${postId}`
      );
      const { _id, images, caption, totalLikeCount, postedBy } =
        response.data.data;
      const { avatar, username } = response.data.data.ownerDetails[0];
      setPost({
        _id,
        avatar,
        username,
        images,
        caption,
        totalLikeCount,
        postedBy,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLocalLoad(false);
    }
  };

  useEffect(() => {
    const data = posts.find((post) => post._id === postId);
    if (data) {
      setPost({
        _id: data._id,
        avatar: data.userDetails.avatar,
        username: data.userDetails.username,
        images: data.images,
        caption: data.caption,
        totalLikeCount: data.totalLikesOnPost,
        postedBy: data.postedBy,
      });
    } else {
      setLocalLoad(true);
      fetchProfilePostData();
    }
    if (isLoggedIn) {
      setLikeLoad(true);
      fetchIsLiked(postId);
    }
  }, []);

  return (
    <>
      {localLoad ? (
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 w-full p-4">
          <div className="flex gap-4 items-center">
            <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
            <div className="flex flex-col gap-2">
              <div className="skeleton h-3 w-20"></div>
              <div className="skeleton h-3 w-28"></div>
            </div>
          </div>
          <div className="skeleton h-72 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      ) : (
        <div
          className={`p-4 flex flex-col gap-4 border-y ${
            darkMode ? "border-neutral-700" : "border-base-300"
          }`}
        >
          <Link
            to={`/user-profile/${post.postedBy}`}
            className="flex gap-4 items-center"
          >
            <div>
              {post.avatar ? (
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={post.avatar}
                  alt="avatar"
                />
              ) : (
                <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
              )}
            </div>
            <p className="font-bold hover:cursor-pointer">{post.username}</p>
          </Link>
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
            {likeLoad ? (
              <div>
                <svg
                  aria-hidden="true"
                  class="w-6 h-6 animate-spin text-[#C9C9C9] fill-[#FF0000]"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            ) : (
              <>
                <div
                  className={`flex gap-4 items-center ${
                    isLiked ? "block" : "hidden"
                  }`}
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
                  className={`flex gap-4 items-center ${
                    isLiked ? "hidden" : "block"
                  }`}
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
              </>
            )}
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
            <Link
              to={`/user-profile/${post.postedBy}`}
              className="font-bold underline underline-offset-2 hover:cursor-pointer"
            >
              {post.username}
            </Link>{" "}
            {post.caption}
          </p>
        </div>
      )}
    </>
  );
}

export default SingleCard;
