import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { base } from "../baseUrl.js";
import { useSelector } from "react-redux";
import SingleConnection from "./SingleConnection.jsx";
import { useLocation } from "react-router-dom";

function Followings() {
  const location = useLocation();
  const isFollowingPage = location.pathname.includes("/followings");
  const [followings, setFollowings] = useState([]);
  const { darkMode } = useSelector((state) => state.theme);
  const { isLoggedIn } = useSelector((state) => state.user);

  const fetchFollowings = async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/connection/get-following`
      );
      if (response.data.message === "No followings") {
        setFollowers([]);
        return;
      }
      setFollowings(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchFollowings();
    }
  }, []);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b lg:border-0 py-0 ${
        isFollowingPage ? "px-4" : ""
      } ${darkMode ? "border-neutral-700" : "border-base-300"}`}
    >
      {isFollowingPage && (
        <h3 className="py-4 text-xl font-bold">Followings</h3>
      )}
      <div className="flex flex-col gap-4">
        {!followings.length && <div>No Following to show</div>}
        {followings.map((following) => (
          <SingleConnection
            key={following._id}
            details={following.followingDetails[0]}
            id={following._id}
          />
        ))}
      </div>
    </div>
  );
}

export default Followings;
