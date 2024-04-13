import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { base } from "../baseUrl.js";
import { useSelector } from "react-redux";
import SingleConnection from "./SingleConnection.jsx";
import { useLocation } from "react-router-dom";

function Followers() {
  const location = useLocation();
  const isFollowerPage = location.pathname.includes("/followers");
  const [followers, setFollowers] = useState([]);
  const { darkMode } = useSelector((state) => state.theme);
  const { isLoggedIn } = useSelector((state) => state.user);

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/connection/get-followers`
      );
      if (response.data.message === "No followers") {
        setFollowers([]);
        return;
      }
      setFollowers(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchFollowers();
    }
  }, []);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b py-0 ${
        isFollowerPage ? "px-4" : ""
      } ${darkMode ? "border-neutral-700" : "border-base-300"}`}
    >
      {isFollowerPage && <h3 className="py-4 text-xl font-bold">Followers</h3>}
      <div className="flex flex-col gap-4">
        {!followers.length && <div>No Follower to show</div>}
        {followers.map((follower) => (
          <SingleConnection
            key={follower._id}
            details={follower.followerDetails[0]}
            id={follower._id}
          />
        ))}
      </div>
    </div>
  );
}

export default Followers;
