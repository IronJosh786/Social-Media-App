import React from "react";
import axios from "../axios.js";
import { toast } from "sonner";
import { base } from "../baseUrl.js";
import { fetchFollowers, fetchRequests } from "../features/connectionSlice.js";
import { useDispatch } from "react-redux";

function SingleRequest({ details, requestId }) {
  const dispatch = useDispatch();

  const acceptRequest = async (id) => {
    try {
      await axios.patch(`${base}/api/v1/connection/accept-request/${id}`);
      dispatch(fetchRequests());
      dispatch(fetchFollowers());
      toast.success("Accepted the request");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const declineRequest = async (id) => {
    try {
      await axios.delete(`${base}/api/v1/connection/decline-request/${id}`);
      dispatch(fetchRequests());
      toast.success("Declined the request");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="flex flex-col sm:flex-row lg:flex-col gap-4 justify-between items-start sm:items-center xl:items-start bg-base-300 lg:bg-base-200 p-4 lg:p-2 rounded-box">
      <div className="flex flex-row lg:flex-col xl:flex-row items-center gap-4">
        <img
          src={details.avatar}
          alt="avatar"
          className="h-12 w-12 object-cover rounded-full"
        />
        <div className="text-left lg:text-center xl:text-left">
          <p className="uppercase">{details.fullName}</p>
          <p className="font-medium text-sm">@{details.username}</p>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <button
          onClick={() => declineRequest(requestId)}
          className="btn btn-outline btn-sm lg:btn-xs xl:btn-sm"
        >
          Decline
        </button>
        <button
          onClick={() => acceptRequest(requestId)}
          className="btn btn-primary btn-sm lg:btn-xs xl:btn-sm"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

export default SingleRequest;
