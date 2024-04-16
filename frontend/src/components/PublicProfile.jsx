import axios from "axios";
import { toast } from "sonner";
import { base } from "../baseUrl.js";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import SingleCard from "./SingleCard.jsx";

function PublicProfile() {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState({
    username: "",
    fullName: "",
    bio: "",
    avatar: "",
    coverImage: "",
    posts: [],
    followers: 0,
    followings: 0,
  });
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [text, setText] = useState("Follow");
  const [requestId, setRequestId] = useState("");
  const { isLoggedIn } = useSelector((state) => state.user);
  const { darkMode } = useSelector((state) => state.theme);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/users/get-public-profile/${id}`
      );
      const res = await axios.get(
        `${base}/api/v1/connection/get-public-connection/${id}`
      );
      const { username, fullName, bio, avatar, coverImage } =
        response.data.data.info;
      const { posts } = response.data.data;
      const { followers, followings } = res.data.data;
      setUserDetails({
        username,
        fullName,
        bio,
        avatar,
        coverImage,
        posts,
        followers,
        followings,
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const follow = async () => {
    if (!isLoggedIn) {
      toast.error("Login required");
      return;
    }
    try {
      const response = await axios.post(
        `${base}/api/v1/connection/send-request/${id}`
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
      fetchData();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    fetchConnectionStatus();
  };

  const fetchConnectionStatus = async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/connection/get-is-following/${id}`
      );
      setConnectionStatus(response.data.data);
      try {
        const res = await axios.get(
          `${base}/api/v1/connection/get-connection-status/${id}`
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
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    if (isLoggedIn) {
      fetchConnectionStatus();
    }
  }, [id]);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b pb-4 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <div>
        <div className="relative w-full">
          <img
            className="w-full h-24 md:h-40 object-cover"
            src={userDetails.coverImage}
            alt="cover image"
          />
          <div className="bg-base-200 rounded-full flex justify-center items-center h-24 w-24 md:h-40 md:w-40 absolute -bottom-1/2 left-4">
            <img
              className="p-[1px] rounded-full h-[calc(100%-8px)] w-[calc(100%-8px)] object-cover"
              src={userDetails.avatar}
              alt="avatar"
            />
          </div>
        </div>
      </div>
      <div className="mt-16 md:mt-24 px-4 w-full">
        <p className="uppercase font-bold">{userDetails.fullName}</p>
        <p className="mt-2">@{userDetails.username}</p>
        <p className="max-w-[60ch] mt-2 text-sm">{userDetails.bio}</p>
        <div className="flex gap-4 md:gap-8 mt-4 text-sm">
          <p>
            <span className="font-bold">{userDetails.followers}</span>{" "}
            <span>Followers</span>
          </p>
          <p>
            <span className="font-bold">{userDetails.followings}</span>{" "}
            <span>Followings</span>
          </p>
        </div>
        <button
          onClick={connectionStatus ? unfollow : follow}
          className={`btn btn-sm btn-outline mt-4`}
        >
          {text}
        </button>
        <p className="text-sm font-bold mt-4">Posts</p>
        {userDetails.posts.length ? (
          <div className="flex flex-col gap-4 mt-4">
            {userDetails.posts.map((post) => (
              <SingleCard key={post._id} postId={post._id} />
            ))}
          </div>
        ) : (
          <div className="mt-4">No Post to show</div>
        )}
      </div>
    </div>
  );
}

export default PublicProfile;
