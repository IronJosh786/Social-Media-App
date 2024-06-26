import React, { useEffect, useState } from "react";
import axios from "../axios.js";
import { toast } from "sonner";
import { base } from "../baseUrl.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFollowings } from "../features/connectionSlice.js";

function SingleUser({ user }) {
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [text, setText] = useState("Follow");
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const follow = async () => {
    try {
      const response = await axios.post(
        `${base}/api/v1/connection/send-request/${user._id}`
      );
      toast.info(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      fetchConnectionStatus();
    }
  };

  const handleFollowClick = () => {
    if (!isLoggedIn) {
      toast.error("Login required");
      return;
    }
    if (text === "Follow") {
      setText("Pending");
    }
    follow();
  };

  const unfollow = async () => {
    try {
      const response = await axios.delete(
        `${base}/api/v1/connection/decline-request/${requestId}`
      );
      toast.success("Connection removed");
      dispatch(fetchFollowings());
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      fetchConnectionStatus();
    }
  };

  const handleUnFollowClick = () => {
    if (!isLoggedIn) {
      toast.error("Login required");
      return;
    }
    if (text === "Unfollow") {
      setText("Follow");
    }
    unfollow();
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      fetchConnectionStatus();
    }
  }, []);

  return (
    <>
      {loading ? (
        <div className="skeleton p-4 w-80 h-52"></div>
      ) : (
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
              onClick={
                connectionStatus ? handleUnFollowClick : handleFollowClick
              }
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
      )}
    </>
  );
}

export default SingleUser;
