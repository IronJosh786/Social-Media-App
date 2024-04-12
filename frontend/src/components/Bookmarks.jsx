import React, { useEffect, useState } from "react";
import axios from "axios";
import { base } from "../baseUrl.js";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import SingleCard from "./SingleCard.jsx";

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const { darkMode } = useSelector((state) => state.theme);
  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/bookmark/get-all-bookmarks`
      );
      setBookmarks(response.data.bookmarks);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);
  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b pb-4 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <div className="flex flex-col">
        {bookmarks.map((bookmark) => (
          <SingleCard key={bookmark._id} postId={bookmark.post} />
        ))}
      </div>
    </div>
  );
}

export default Bookmarks;
