import React, { useEffect, useState } from "react";
import axios from "../axios.js";
import { toast } from "sonner";
import { base } from "../baseUrl.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SingleUser({ user }) {
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [text, setText] = useState("Follow");
  const [requestId, setRequestId] = useState("");
  const { isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const follow = async () => {
    if (!isLoggedIn) {
      toast.error("Login required");
      return;
    }
    try {
      const response = await axios.post(
        `${base}/api/v1/connection/send-request/${user._id}`
      );
      toast.info(response.data.message);
      fetchConnectionStatus();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const unfollow = async () => {
    if (!isLoggedIn) {
      toast.error("Login required");
      return;
    }
    try {
      const response = await axios.delete(
        `${base}/api/v1/connection/decline-request/${requestId}`
      );
      toast.success("Connection removed");
      fetchConnectionStatus();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    fetchConnectionStatus();
  };

  const fetchConnectionStatus = async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/connection/get-is-following/${user._id}`
      );
      setConnectionStatus(response.data.data);
      try {
        const res = await axios.get(
          `${base}/api/v1/connection/get-connection-status/${user._id}`
        );
        if (res.data.data?.status === "pending") {
          setText("Pending");
        } else if (res.data.data?.status === "accepted") {
          setText("Unfollow");
          setRequestId(res.data.data._id);
        } else {
          setText("Follow");
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchConnectionStatus();
    }
  }, []);

  return (
    <div className="glass flex flex-col p-4 bg-base-300 max-w-[400px] w-full rounded-box items-center text-center">
      <div className="flex gap-4 items-center">
        <img
          className="h-16 w-16 object-cover rounded-full"
          src={user.avatar}
          alt="avatar"
        />
      </div>
      <p className="uppercase mt-4">{user.fullName}</p>
      <p className="font-semibold mt-2">@{user.username}</p>
      <p className="mt-4">{user.bio}</p>
      <div className="flex gap-4 mt-8">
        <button
          onClick={connectionStatus ? unfollow : follow}
          className={`btn btn-sm btn-outline`}
        >
          {text}
        </button>
        <button
          onClick={() => navigate(`/user-profile/${user._id}`)}
          className="btn btn-sm btn-primary"
        >
          Profile
        </button>
      </div>
    </div>
  );
}

export default SingleUser;
