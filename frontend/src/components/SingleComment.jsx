import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { base } from "../baseUrl.js";
import { useNavigate } from "react-router-dom";

function SingleComment({ comment, id, parentFetch, postId }) {
  const { darkMode } = useSelector((state) => state.theme);
  const { isLoggedIn } = useSelector((state) => state.user);

  const [isLiked, setIsLiked] = useState(false);
  const [commentLikes, setCommentLikes] = useState(0);
  const [commentContent, setCommentContent] = useState(comment.content);
  const [isOwner, setIsOwner] = useState(false);
  const [newComment, setNewComment] = useState("");

  const navigate = useNavigate();

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
      setCommentContent(res.data.data.commentDetails.content);
      setIsOwner(res.data.data.isOwner);
      setCommentLikes(res.data.data.likeCount);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchData(id);
  }, []);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentUpdate = async (id) => {
    if (!newComment) {
      toast.error("Cannot post empty comment");
      return;
    }
    try {
      const response = await axios.patch(
        `${base}/api/v1/comment/edit-comment/${id}`,
        { content: newComment }
      );
      fetchData(comment._id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleCommentDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${base}/api/v1/comment/delete-comment/${id}`
      );
      await parentFetch(postId);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div
      className={`p-2 border ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <dialog id={`my_modal_1_${comment._id}`} className="modal">
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        <div className="modal-box">
          <p className="p-2 md:p-4">
            Do you really want to delete this comment?
          </p>
          <form
            method="dialog"
            onSubmit={() => {
              handleCommentDelete(id);
            }}
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
      <dialog id={`my_modal_2_${comment._id}`} className="modal modal-middle">
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        <div className="modal-box">
          <form
            onSubmit={() => {
              handleCommentUpdate(comment._id);
            }}
            method="dialog"
            className="card-body grid grid-cols-2 p-2 md:p-4"
          >
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Caption</span>
              </label>
              <input
                type="text"
                placeholder="Comment"
                className="input input-bordered"
                id="comment"
                value={newComment}
                onChange={handleCommentChange}
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
      <div className="flex gap-4">
        <div className="shrink-0">
          <img
            src={comment.commentedBy[0].avatar}
            alt="commentor profile picture"
            className="h-8 w-8 object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col w-full">
          <button
            onClick={() =>
              navigate(`/user-profile/${comment.commentedBy[0]._id}`)
            }
            className="font-bold text-sm text-left"
          >
            {comment.commentedBy[0].username}
          </button>
          <div className="py-1">{commentContent}</div>
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
          {isOwner && (
            <div className="flex gap-4 justify-end mt-2">
              <div className="text-base">
                <i
                  onClick={() =>
                    document
                      .getElementById(`my_modal_2_${comment._id}`)
                      .showModal()
                  }
                  className="ri-pencil-line hover:cursor-pointer"
                ></i>
              </div>
              <div className="text-base">
                <i
                  onClick={() =>
                    document
                      .getElementById(`my_modal_1_${comment._id}`)
                      .showModal()
                  }
                  className="ri-delete-bin-6-line hover:cursor-pointer"
                ></i>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleComment;
