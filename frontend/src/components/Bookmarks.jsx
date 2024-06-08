import { toast } from "sonner";
import axios from "../axios.js";
import { base } from "../baseUrl.js";
import { useSelector } from "react-redux";
import SingleCard from "./SingleCard.jsx";
import React, { useEffect, useState } from "react";

function Bookmarks() {
  const [loading, setLoading] = useState(false);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchBookmarks();
  }, []);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b pb-4 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <h3 className="p-4 text-xl font-bold">Bookmarks</h3>
      {loading ? (
        <div className="w-full flex flex-col gap-4">
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
        </div>
      ) : !bookmarks.length ? (
        <div className="p-4">No Bookmarks to show</div>
      ) : (
        bookmarks.map((bookmark) => (
          <SingleCard key={bookmark._id} postId={bookmark.post} />
        ))
      )}
    </div>
  );
}

export default Bookmarks;
