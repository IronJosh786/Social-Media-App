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
      if (response.data.message === "No bookmarks") {
        return;
      }
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
      <h3 className="p-4 text-xl font-bold">Bookmarks</h3>
      {!bookmarks.length && <div className="p-4">No Bookmarks to show</div>}
      {bookmarks.map((bookmark) => (
        <SingleCard key={bookmark._id} postId={bookmark.post} />
      ))}
    </div>
  );
}

export default Bookmarks;
