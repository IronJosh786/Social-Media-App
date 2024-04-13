import React, { useEffect, useState } from "react";
import SingleRequest from "./SingleRequest";
import axios from "axios";
import { toast } from "sonner";
import { base } from "../baseUrl.js";
import { useSelector } from "react-redux";

function Rightbar() {
  const [requests, setRequests] = useState([]);
  const { isLoggedIn } = useSelector((state) => state.user);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/connection/get-pending-requests`
      );
      if (response.data.message === "No pending requests") {
        setRequests([]);
        return;
      }
      setRequests(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchRequests();
    }
  }, []);
  return (
    <div className="hidden lg:block lg:col-span-3 p-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-full max-w-xs"
        />
        <button className="absolute right-2 bottom-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="collapse bg-base-300 mt-8">
        <input type="checkbox" />
        <div className="collapse-title text-md font-medium flex justify-between items-center px-4">
          <p>Requests</p>
          <i className="ri-arrow-down-s-line"></i>
        </div>
        <div className="collapse-content">
          <div className="flex flex-col gap-4">
            {!requests.length && <div>No request to show</div>}
            {requests.map((request) => (
              <SingleRequest
                key={request._id}
                details={request.requestorDetails[0]}
                requestId={request._id}
                fetchRequests={fetchRequests}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rightbar;
