import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleConnection from "./SingleConnection.jsx";
import { useLocation } from "react-router-dom";
import { fetchFollowings } from "../features/connectionSlice.js";

function Followings() {
  const location = useLocation();
  const isFollowingPage = location.pathname.includes("/followings");

  const { followings, followingsError } = useSelector(
    (state) => state.connection
  );
  const { darkMode } = useSelector((state) => state.theme);
  const { isLoggedIn } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (followingsError) {
      toast.error(followingsError);
    }
  }, [followingsError]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchFollowings());
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
      <div className="flex flex-col gap-2 overflow-hidden">
        {!followings.length && (
          <div className="lg:px-2">No Following to show</div>
        )}
        {followings.map((following) => (
          <SingleConnection
            key={following._id}
            details={following.followingDetails[0]}
            id={following.followingDetails[0]._id}
          />
        ))}
      </div>
    </div>
  );
}

export default Followings;
