import React, { useEffect, useState } from "react";
import SingleCard from "./SingleCard.jsx";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { base } from "../baseUrl.js";
import { toast } from "sonner";
import { setUserData } from "../features/userSlice.js";
import { NavLink } from "react-router-dom";

function Profile() {
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    fullName: "",
    bio: "",
    coverImage: "",
    avatar: "",
    posts: [],
    followers: [],
    followings: [],
  });

  const [updatedDetails, setUpdatedDetails] = useState({
    username: "",
    fullName: "",
    bio: "",
    oldpassword: "",
    newpassword: "",
  });

  const [updatedImages, setUpdatedImages] = useState({
    newAvatar: null,
    newCoverImage: null,
  });

  const handleFileChange = (e) => {
    setUpdatedImages({ ...updatedImages, [e.target.id]: e.target.files[0] });
    toast.info("Image Selected");
  };

  const handleChange = (e) => {
    setUpdatedDetails({ ...updatedDetails, [e.target.id]: e.target.value });
  };

  const handleImageSubmit = async () => {
    if (!updatedImages.newAvatar && !updatedImages.newCoverImage) {
      toast.error("Atleast one image is required");
    }
    if (updatedImages.newAvatar) {
      const avatar = new FormData();
      avatar.append("avatar", updatedImages.newAvatar);
      const id = toast.loading("Processing...");
      try {
        const response = await axios.patch(
          `${base}/api/v1/users/edit-avatar`,
          avatar,
          { withCredentials: true }
        );
        fetchData();
        dispatch(setUserData(response.data.data.avatar));
        toast.success(response.data.message);
        setUpdatedImages({ ...updatedImages, newAvatar: null });
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        toast.dismiss(id);
      }
    }
    if (updatedImages.newCoverImage) {
      const coverImage = new FormData();
      coverImage.append("coverImage", updatedImages.newCoverImage);
      const id = toast.loading("Processing...");
      try {
        const response = await axios.patch(
          `${base}/api/v1/users/edit-cover-image`,
          coverImage,
          { withCredentials: true }
        );
        fetchData();
        toast.success(response.data.message);
        setUpdatedImages({ ...updatedImages, newCoverImage: null });
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        toast.dismiss(id);
      }
    }
    setUpdatedImages({
      newAvatar: null,
      newCoverImage: null,
    });
  };

  const handleDetailSubmit = async () => {
    const data = {
      ...(updatedDetails.username && {
        username: updatedDetails.username.trim(),
      }),
      ...(updatedDetails.fullName && {
        fullName: updatedDetails.fullName.trim(),
      }),
      ...(updatedDetails.bio && { bio: updatedDetails.bio.trim() }),
      ...(updatedDetails.oldpassword && {
        currentPassword: updatedDetails.oldpassword.trim(),
      }),
      ...(updatedDetails.newpassword && {
        newPassword: updatedDetails.newpassword.trim(),
      }),
    };

    try {
      const response = await axios.patch(
        `${base}/api/v1/users/edit-profile`,
        data,
        { withCredentials: true }
      );
      fetchData();
      setUpdatedDetails({
        username: "",
        fullName: "",
        bio: "",
        oldpassword: "",
        newpassword: "",
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/users/get-user-profile`,
        { withCredentials: true }
      );
      setUserDetails({
        username: response.data.data.username,
        email: response.data.data.email,
        fullName: response.data.data.fullName,
        bio: response.data.data.bio,
        coverImage: response.data.data.coverImage,
        avatar: response.data.data.avatar,
        posts: response.data.data.posts,
        followers: response.data.data.followers,
        followings: response.data.data.followings,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("isLoggedIn"))) {
      fetchData();
    }
  }, []);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b pb-4 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <dialog id="my_modal_6" className="modal modal-middle">
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        <div className="modal-box">
          <form
            method="dialog"
            onSubmit={handleImageSubmit}
            className="card-body grid grid-cols-2 p-2 md:p-4"
          >
            <label htmlFor="newAvatar" className="btn btn-outline">
              Select Avatar
            </label>
            <input
              id="newAvatar"
              type="file"
              onChange={handleFileChange}
              className="hidden text-[0.625rem] file-input file-input-bordered file-input-md w-full max-w-xs"
            />
            <label htmlFor="newCoverImage" className="btn btn-outline">
              Select Cover Image
            </label>
            <input
              id="newCoverImage"
              type="file"
              onChange={handleFileChange}
              className="hidden text-[0.625rem] file-input file-input-bordered file-input-md w-full max-w-xs"
            />
            <div className="mt-6 btn hidden lg:flex">Esc to close</div>
            <div className="mt-6 btn lg:hidden">Click outside to close</div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <dialog id="my_modal_5" className="modal modal-middle">
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        <div className="modal-box">
          <form
            onSubmit={handleDetailSubmit}
            method="dialog"
            className="card-body grid grid-cols-2 p-2 md:p-4"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered"
                id="fullName"
                value={updatedDetails.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered"
                id="username"
                value={updatedDetails.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Old Password</span>
              </label>
              <input
                type="password"
                placeholder="Old Password"
                className="input input-bordered"
                id="oldpassword"
                value={updatedDetails.oldpassword}
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                placeholder="New Password"
                className="input input-bordered"
                id="newpassword"
                value={updatedDetails.newpassword}
                onChange={handleChange}
              />
            </div>
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <input
                type="text"
                placeholder="Bio"
                className="input input-bordered"
                id="bio"
                value={updatedDetails.bio}
                onChange={handleChange}
              />
            </div>
            <div className="mt-6 btn hidden lg:flex">Esc to close</div>
            <div className="mt-6 btn lg:hidden">Click outside to close</div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </div>
      </dialog>
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
          <div className="absolute right-4 -bottom-24 sm:-bottom-12 flex flex-col sm:flex-row gap-4">
            <button
              className="btn btn-outline text-[0.625rem] md:text-xs p-1 h-8 min-h-4"
              onClick={() => document.getElementById("my_modal_6").showModal()}
            >
              Edit Images
            </button>
            <button
              className="btn btn-outline text-[0.625rem] md:text-xs p-1 h-8 min-h-4"
              onClick={() => document.getElementById("my_modal_5").showModal()}
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
      <div className="mt-16 md:mt-24 px-4 w-full">
        <p className="uppercase font-bold">{userDetails.fullName}</p>
        <p className="mt-2">@{userDetails.username}</p>
        <p className="max-w-[60ch] mt-2 text-sm">{userDetails.bio}</p>
        <div className="flex gap-4 md:gap-8 mt-4 text-sm">
          <p>
            <span className="font-bold">{userDetails.followers.length}</span>{" "}
            <NavLink
              to={"/followers"}
              className={`lg:hidden underline underline-offset-4`}
            >
              Followers
            </NavLink>
            <span className="hidden lg:inline-flex">Followers</span>
          </p>
          <p>
            <span className="font-bold">{userDetails.followings.length}</span>{" "}
            <NavLink
              to={"/followings"}
              className={`lg:hidden underline underline-offset-4`}
            >
              Followings
            </NavLink>
            <span className="hidden lg:inline-flex">Followings</span>
          </p>
        </div>
        <p className="text-sm font-bold mt-8">Posts</p>
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

export default Profile;
