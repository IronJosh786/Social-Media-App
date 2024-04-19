import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleConnection from "./SingleConnection.jsx";
import { useLocation } from "react-router-dom";
import { fetchFollowers } from "../features/connectionSlice.js";
import { toast } from "sonner";

function Followers() {
  const location = useLocation();
  const isFollowerPage = location.pathname.includes("/followers");

  const { followers, followersError } = useSelector(
    (state) => state.connection
  );
  const { darkMode } = useSelector((state) => state.theme);
  const { isLoggedIn } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (followersError) {
      toast.error(followersError);
    }
  }, [followersError]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchFollowers());
    }
  }, []);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b lg:border-0 py-0 ${
        isFollowerPage ? "px-4" : ""
      } ${darkMode ? "border-neutral-700" : "border-base-300"}`}
    >
      {isFollowerPage && <h3 className="py-4 text-xl font-bold">Followers</h3>}
      <div className="flex flex-col gap-2 overflow-hidden">
        {!followers.length && (
          <div className="lg:px-2">No Follower to show</div>
        )}
        {followers.map((follower) => (
          <SingleConnection
            key={follower._id}
            details={follower.followerDetails[0]}
            id={follower.followerDetails[0]._id}
          />
        ))}
      </div>
    </div>
  );
}

export default Followers;
