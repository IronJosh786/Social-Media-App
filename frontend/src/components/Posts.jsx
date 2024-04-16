import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { base } from "../baseUrl.js";
import { toast } from "sonner";
import axios from "axios";
import SingleCard from "./SingleCard.jsx";

function Posts() {
  const { darkMode } = useSelector((state) => state.theme);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [posts, setPosts] = useState([]);
  const [all, setAll] = useState(true);
  const [followings, setFollowings] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/post/get-all-posts?page=${page}&limit=${limit}`
      );
      setPosts(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchFollowingsPost = async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/post/get-followings-post?page=${page}&limit=${limit}`
      );
      setPosts(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const incrementPage = async () => {
    if (!posts.length || posts.length < 10) {
      toast.error("No more posts to fetch");
      return;
    }
    setPage((prev) => prev + 1);
  };

  const decrementPage = async () => {
    if (page === 1) {
      toast.error("This is the start of posts");
      return;
    }
    setPage((prev) => prev - 1);
  };

  const handleAllClick = () => {
    const page = 1;
    setPage(page);
    setAll(true);
    setFollowings(false);
  };

  const handleFollowingsClick = () => {
    const page = 1;
    setPage(page);
    setAll(false);
    setFollowings(true);
  };

  useEffect(() => {
    if (all) {
      fetchPosts();
    } else {
      fetchFollowingsPost();
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page, all]);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <div className="flex justify-between w-full">
        <button
          onClick={handleAllClick}
          className={`btn grow w-1/2 ${all ? "bg-base-300" : ""}`}
        >
          All
        </button>
        <button
          onClick={handleFollowingsClick}
          className={`btn grow w-1/2 ${followings ? "bg-base-300" : ""}`}
        >
          Followings
        </button>
      </div>
      {!posts.length && <p className="p-4 text-center">No Post to show</p>}
      {posts.map((post) => (
        <SingleCard key={post._id} postId={post._id} />
      ))}
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
