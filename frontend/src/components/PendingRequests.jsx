import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { base } from "../baseUrl.js";
import SingleRequest from "./SingleRequest.jsx";

function PendingRequests() {
  const { darkMode } = useSelector((state) => state.theme);
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
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b p-4 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <h3 className="text-xl font-bold mb-8">Pending Requests</h3>
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
  );
}

export default PendingRequests;
