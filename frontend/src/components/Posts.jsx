import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import SingleCard from "./SingleCard.jsx";
import {
  fetchData,
  fetchFollowingsData,
  setPage,
  setAllPosts,
} from "../features/dataSlice.js";

function Posts() {
  const limit = 10;
  const { posts } = useSelector((state) => state.data);
  const { page } = useSelector((state) => state.data);
  const { allPosts } = useSelector((state) => state.data);
  const { error } = useSelector((state) => state.data);
  const { isLoggedIn } = useSelector((state) => state.user);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const incrementPage = async () => {
    if (!posts.length || posts.length < 10) {
      toast.error("No more posts to fetch");
      return;
    }
    dispatch(setPage(page + 1));
  };

  const decrementPage = async () => {
    if (page === 1) {
      toast.error("This is the start of posts");
      return;
    }
    dispatch(setPage(page - 1));
  };

  const handleAllClick = () => {
    dispatch(setPage(1));
    dispatch(setAllPosts(true));
  };

  const handleFollowingsClick = () => {
    if (!isLoggedIn) {
      toast.error("Login required");
      return;
    }
    dispatch(setPage(1));
    dispatch(setAllPosts(false));
  };

  useEffect(() => {
    if (allPosts) {
      dispatch(fetchData({ page, limit }));
    } else {
      dispatch(fetchFollowingsData({ page, limit }));
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page, allPosts]);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <div className="flex justify-between w-full">
        <button
          onClick={handleAllClick}
          className={`btn grow w-1/2 ${allPosts ? "bg-base-300" : ""}`}
        >
          All
        </button>
        <button
          onClick={handleFollowingsClick}
          className={`btn grow w-1/2 ${!allPosts ? "bg-base-300" : ""}`}
        >
          Followings
        </button>
      </div>
      {posts && !posts.length && (
        <p className="p-4 text-center">No Post to show</p>
      )}
      {posts &&
        posts.map((post) => <SingleCard key={post._id} postId={post._id} />)}
      <div className="flex justify-center my-2">
        <div className="join drop-shadow-md">
          <button onClick={decrementPage} className="join-item btn btn-sm">
            «
          </button>
          <button className="join-item btn btn-sm">{page}</button>
          <button onClick={incrementPage} className="join-item btn btn-sm">
            »
          </button>
        </div>
      </div>
    </div>
  );
}

export default Posts;
