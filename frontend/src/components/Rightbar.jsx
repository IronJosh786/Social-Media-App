import React from "react";
import { useSelector } from "react-redux";
import Followers from "./Followers.jsx";
import Followings from "./Followings.jsx";
import PendingRequests from "./PendingRequests.jsx";

function Rightbar() {
  const { isLoggedIn } = useSelector((state) => state.user);
  return (
    <div className="hidden lg:flex flex-col gap-4 lg:col-span-3 p-4">
      {isLoggedIn && (
        <div className="collapse bg-base-300">
          <input type="checkbox" />
          <div className="collapse-title text-md font-medium flex justify-between items-center px-4">
            <p>Requests</p>
            <i className="ri-arrow-down-s-line"></i>
          </div>
          <div className="collapse-content p-2 overflow-hidden">
            <PendingRequests />
          </div>
        </div>
      )}
      {isLoggedIn && (
        <div className="collapse bg-base-300">
          <input type="checkbox" />
          <div className="collapse-title text-md font-medium flex justify-between items-center px-4">
            <p>Followers</p>
            <i className="ri-arrow-down-s-line"></i>
          </div>
          <div className="collapse-content p-2 overflow-hidden">
            <Followers />
          </div>
        </div>
      )}
      {isLoggedIn && (
        <div className="collapse bg-base-300">
          <input type="checkbox" />
          <div className="collapse-title text-md font-medium flex justify-between items-center px-4">
            <p>Followings</p>
            <i className="ri-arrow-down-s-line"></i>
          </div>
          <div className="collapse-content p-2 overflow-hidden">
            <Followings />
          </div>
        </div>
      )}
    </div>
  );
}

export default Rightbar;
