import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { base } from "../baseUrl.js";
import { useSelector } from "react-redux";
import SingleRequest from "./SingleRequest.jsx";
import { useLocation } from "react-router-dom";

function PendingRequests() {
  const location = useLocation();
  const isRequestPage = location.pathname.includes("/pending-requests");
  const [requests, setRequests] = useState([]);
  const { darkMode } = useSelector((state) => state.theme);
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
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b py-0 ${
        isRequestPage ? "px-4" : ""
      } ${darkMode ? "border-neutral-700" : "border-base-300"}`}
    >
      {isRequestPage && (
        <h3 className="py-4 text-xl font-bold">Pending Requests</h3>
      )}
      <div className="flex flex-col gap-4">
        {!requests.length && <div className="mt-4">No Request to show</div>}
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
  );
}

export default PendingRequests;
