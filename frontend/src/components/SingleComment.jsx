import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { base } from "../baseUrl.js";

function SingleComment({ comment }) {
  const { darkMode } = useSelector((state) => state.theme);
  const { isLoggedIn } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(false);
  const [commentLikes, setCommentLikes] = useState(0);

  const handleChange = (e) => {
    setContent(e.target.innerText);
  };

  const toggleLike = async (id) => {
    try {
      const response = await axios.post(
        `${base}/api/v1/like/toggle-comment-like/${id}`
      );
      fetchData(id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchData = async (id) => {
    if (isLoggedIn) {
      try {
        const response = await axios.get(
          `${base}/api/v1/like/is-document-liked/${id}`
        );
        setIsLiked(response.data.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    try {
      const res = await axios.get(
        `${base}/api/v1/comment/get-comments-like/${id}`
      );
      setCommentLikes(res.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchData(comment._id);
  }, []);

  return (
    <div
      key={comment._id}
      className={`p-2 border ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <div className="flex gap-4">
        <div className="shrink-0">
          <img
            src={comment.commentedBy[0].avatar}
            alt="commentor profile picture"
            className="h-8 w-8 object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col w-full">
          <p className="font-bold text-sm">{comment.commentedBy[0].username}</p>
          <div
            contentEditable={isEditing}
            onChange={handleChange}
            className="py-1"
          >
            {content}
          </div>
          <div
            className={`mt-2 flex gap-4 items-center ${
              isLiked ? "block" : "hidden"
            }`}
          >
            <button
              onClick={() => {
                toggleLike(comment._id);
              }}
              className="h-4 w-4 active:scale-90 transition all ease-in-out duration-200"
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
            <span className="font-bold text-xs">
              {commentLikes}
              <span className="font-normal"> Likes</span>
            </span>
          </div>
          <div
            className={`mt-2 flex gap-4 items-center ${
              isLiked ? "hidden" : "block"
            }`}
          >
            <button
              onClick={() => {
                toggleLike(comment._id);
              }}
              className="h-4 w-4 active:scale-90 transition all ease-in-out duration-200"
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
            <span className="font-bold text-xs">
              {commentLikes}
              <span className="font-normal"> Likes</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleComment;
