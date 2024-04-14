import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { base } from "../baseUrl.js";
import SingleUser from "./SingleUser.jsx";
import SingleCard from "./SingleCard.jsx";

function Search() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState({
    users: [],
    posts: [],
  });
  const { darkMode } = useSelector((state) => state.theme);

  const handleSubmit = async (q) => {
    if (q === "") {
      return;
    }
    try {
      const response = await axios.get(
        `${base}/api/v1/users/search?query=${q}`
      );
      const { users, posts } = response.data.data;

      setResult({
        ...result,
        users: users || [],
        posts: posts || [],
      });
      localStorage.setItem("searchQuery", q);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const storedQuery = localStorage.getItem("searchQuery");
    if (storedQuery) {
      setQuery(storedQuery);
      handleSubmit(storedQuery);
    }
  }, []);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b px-4 py-0 pb-4 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <h3 className="py-4 text-xl font-bold">Search</h3>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input input-bordered w-full pr-8"
        />
        <button
          onClick={() => {
            handleSubmit(query);
          }}
          className="absolute right-2 bottom-1/2 transform translate-y-1/2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-5 h-5 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <h3 className="mt-4 text-lg font-medium">Result for "{query}"</h3>
      <div className="mt-4">
        <h4>Users</h4>
        <div className="grid grid-cols-1 gap-4 p-4 justify-items-center">
          {result.users.map((user) => (
            <SingleUser key={user._id} user={user} />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="mb-4">Posts</h4>
        <div className="grid grid-cols-1 justify-items-center p-0">
          {result.posts.map((post) => (
            <SingleCard key={post._id} postId={post._id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
