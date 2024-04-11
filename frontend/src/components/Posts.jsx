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
      setAll(true);
      setFollowings(false);
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
      setAll(false);
      setFollowings(true);
      setPosts(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b pb-4 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <div className="flex justify-between w-full">
        <button
          onClick={fetchPosts}
          className={`btn grow w-1/2 ${all ? "bg-base-300" : ""}`}
        >
          All
        </button>
        <button
          onClick={fetchFollowingsPost}
          className={`btn grow w-1/2 ${followings ? "bg-base-300" : ""}`}
        >
          Followings
        </button>
      </div>
      {posts.map((post) => (
        <SingleCard key={post._id} postId={post._id} />
      ))}
    </div>
  );
}

export default Posts;
