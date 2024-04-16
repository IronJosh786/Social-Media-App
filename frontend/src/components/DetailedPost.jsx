import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { base } from "../baseUrl.js";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../App.css";
import SingleComment from "./SingleComment.jsx";

function DetailedPost() {
  const { id } = useParams();
  const { darkMode } = useSelector((state) => state.theme);
  const { isLoggedIn } = useSelector((state) => state.user);

  const [postCaption, setPostCaption] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [post, setPost] = useState({
    images: [],
    caption: "",
    totalLikeCount: 0,
    commentsOnPost: [],
    avatar: "",
    username: "",
    isOwner: false,
    isAdmin: false,
  });

  const navigate = useNavigate();

  const fetchPostDetails = async (id) => {
    try {
      const response = await axios.get(`${base}/api/v1/post/get-post/${id}`);
      const {
        images,
        caption,
        totalLikeCount,
        commentsOnPost,
        isOwner,
        isAdmin,
      } = response.data.data;
      const { avatar, username } = response.data.data.ownerDetails[0];
      setPost({
        images,
        caption,
        totalLikeCount,
        commentsOnPost,
        avatar,
        username,
        isOwner,
        isAdmin,
      });
      setPostCaption(response.data.data.caption);
      if (isLoggedIn) {
        try {
          const res = await axios.get(
            `${base}/api/v1/like/is-document-liked/${id}`
          );
          const res2 = await axios.get(
            `${base}/api/v1/bookmark/is-bookmarked/${id}`
          );
          setIsLiked(res.data.data);
          setIsBookmarked(res2.data.data);
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

  const handleCommentContentChange = (e) => {
    setNewComment(e.target.value);
  };

  const addNewComment = async () => {
    if (!newComment || !newComment.trim()) {
      toast.error("Cannot post empty comment");
      return;
    }
    try {
      const response = await axios.post(
        `${base}/api/v1/comment/add-comment/${id}`,
        { content: newComment }
      );
      fetchPostDetails(id);
      setNewComment("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const toggleLike = async (id) => {
    try {
      const response = await axios.post(
        `${base}/api/v1/like/toggle-post-like/${id}`
      );
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      fetchPostDetails(id);
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
    toggleLike(id);
  };

  const toggleBookmark = async (id) => {
    try {
      const response = await axios.post(
        `${base}/api/v1/bookmark/toggle-bookmark/${id}`
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      fetchPostDetails(id);
    }
  };

  const handleBookmarkClick = () => {
    if (!isLoggedIn) {
      toast.error("Login Required");
      return;
    }
    const flag = !isBookmarked;
    setIsBookmarked(flag);
    toggleBookmark(id);
  };

  const handleCaptionChange = (e) => {
    setPostCaption(e.target.value);
  };

  const handleCaptionUpdate = async () => {
    if (!postCaption || !postCaption.trim()) {
      toast.error("Cannot post empty caption");
      return;
    }
    try {
      const response = await axios.patch(
        `${base}/api/v1/post/edit-post/${id}`,
        {
          caption: postCaption,
        }
      );
      fetchPostDetails(id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeletePost = async () => {
    try {
      toggleBookmark(id);
      const response = await axios.delete(
        `${base}/api/v1/post/delete-post/${id}`
      );
      navigate("/profile");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const getBackgroundImageStyle = () => {
    const strokeColor = darkMode
      ? "rgb(255 255 255 / 0.2)"
      : "rgb(0 0 0 / 0.2)";
    return {
      backgroundImage: `url('data:image/svg+xml,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22 width=%228%22 height=%228%22 fill=%22none%22 stroke=%22${strokeColor}%22%3e%3cpath d=%22M0%20.5H31.5V32%22/%3e%3c/svg%3e')`,
    };
  };

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b p-4 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <dialog id="my_modal_3" className="modal">
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        <div className="modal-box">
          <p className="p-2 md:p-4">Do you really want to delete this post?</p>
          <form
            method="dialog"
            onSubmit={handleDeletePost}
            className="card-body grid grid-cols-2 p-2 md:p-4"
          >
            <div className="btn hidden lg:flex">Esc to close</div>
            <div className="btn lg:hidden">Click outside to close</div>
            <div className="form-control">
              <button type="submit" className="btn btn-error">
                Delete
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <dialog id="my_modal_4" className="modal modal-middle">
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        <div className="modal-box">
          <form
            onSubmit={handleCaptionUpdate}
            method="dialog"
            className="card-body grid grid-cols-2 p-2 md:p-4"
          >
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Caption</span>
              </label>
              <input
                type="text"
                placeholder="Bio"
                className="input input-bordered"
                id="bio"
                value={postCaption}
                onChange={handleCaptionChange}
              />
            </div>
            <div className="mt-6 btn hidden lg:flex">Esc to close</div>
            <div className="mt-6 btn lg:hidden">Click outside to close</div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div>
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={post.avatar}
                alt="avatar"
              />
            </div>
            <div className="font-bold">{post.username}</div>
          </div>
          {(post.isOwner || post.isAdmin) && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1">
                <i className="ri-more-2-line"></i>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-28 sm:w-40"
              >
                <li
                  onClick={() =>
                    document.getElementById("my_modal_4").showModal()
                  }
                  className="w-full"
                >
                  <a className="flex justify-center">Edit</a>
                </li>
                <li
                  onClick={() =>
                    document.getElementById("my_modal_3").showModal()
                  }
                  className="w-full"
                >
                  <a className="flex justify-center">Delete</a>
                </li>
              </ul>
            </div>
          )}
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
          <div
            className={`flex gap-4 items-center ${
              isBookmarked ? "block" : "hidden"
            }`}
          >
            <button
              onClick={handleBookmarkClick}
              className="h-6 w-6 active:scale-90 transition all ease-in-out duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fill="#3b82f6"
                  d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2Z"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className={`flex gap-4 items-center ${
              isBookmarked ? "hidden" : "block"
            }`}
          >
            <button
              onClick={handleBookmarkClick}
              className="h-6 w-6 active:scale-90 transition all ease-in-out duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="hover:fill-blue-600 transition all ease-in-out duration-150"
              >
                <path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4324L12 15.6707L18 19.4324V4Z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div>
          <span className="font-bold underline underline-offset-2">
            {post.username}
          </span>{" "}
          <span
            className={`mt-2 py-4 ${
              darkMode ? "border-neutral-700" : "border-base-300"
            }`}
          >
            {post.caption}
          </span>
        </div>
        <div
          className={`p-2 border ${
            darkMode ? "border-neutral-700" : "border-base-300"
          }`}
        >
          <span className="font-bold">Comments</span>
          <div className="mt-2">
            {isLoggedIn && (
              <div className="mb-2 relative">
                <textarea
                  placeholder="Add Comment..."
                  value={newComment}
                  onChange={(e) => {
                    handleCommentContentChange(e);
                  }}
                  className={`textarea textarea-ghost textarea-md w-full resize-none ${
                    darkMode ? "border-neutral-700" : "border-base-300"
                  }`}
                ></textarea>
                <div
                  onClick={addNewComment}
                  className="absolute right-4 bottom-4 btn btn-outline text-[0.625rem] md:text-xs h-8 min-h-4"
                >
                  Add
                </div>
              </div>
            )}
            {!post.commentsOnPost.length && (
              <p className="mt-4">No Comment to show</p>
            )}
            {post.commentsOnPost.map((comment) => {
              return (
                <SingleComment
                  key={comment._id}
                  comment={comment}
                  id={comment._id}
                  parentFetch={fetchPostDetails}
                  postId={id}
                  isAdmin={post.isAdmin}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedPost;
