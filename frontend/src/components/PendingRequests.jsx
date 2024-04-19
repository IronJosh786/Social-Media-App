import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleRequest from "./SingleRequest.jsx";
import { useLocation } from "react-router-dom";
import { fetchRequests } from "../features/connectionSlice.js";
import { toast } from "sonner";

function PendingRequests() {
  const location = useLocation();
  const isRequestPage = location.pathname.includes("/pending-requests");

  const { requests, requestError } = useSelector((state) => state.connection);
  const { darkMode } = useSelector((state) => state.theme);
  const { isLoggedIn } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (requestError) {
      toast.error(requestError);
    }
  }, [requestError]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchRequests());
    }
  }, []);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b lg:border-0 py-0 ${
        isRequestPage ? "px-4" : ""
      } ${darkMode ? "border-neutral-700" : "border-base-300"}`}
    >
      {isRequestPage && (
        <h3 className="py-4 text-xl font-bold">Pending Requests</h3>
      )}
      <div className="flex flex-col gap-2 overflow-hidden">
        {!requests.length && <div className="lg:px-2">No Request to show</div>}
        {requests.map((request) => (
          <SingleRequest
            key={request._id}
            details={request.requestorDetails[0]}
            requestId={request._id}
          />
        ))}
      </div>
    </div>
  );
}

export default PendingRequests;
