import React from "react";
import SingleProfileCard from "./SingleProfileCard";
import { useSelector } from "react-redux";

function Profile() {
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <div
      className={`col-span-12 md:col-span-6 border-x ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <div>
        <div className="relative w-full">
          <img
            className="w-full h-24 md:h-36 object-cover"
            src="https://images.unsplash.com/photo-1696229882092-9b4f29ee73c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3Jvc3MlMjBwYXR0ZXJufGVufDB8fDB8fHww"
            alt="cover image"
          />
          <div className="bg-base-200 rounded-full flex justify-center items-center h-24 w-24 md:h-36 md:w-36 absolute -bottom-1/2 left-4">
            <img
              className="p-[1px] rounded-full h-[calc(100%-8px)] w-[calc(100%-8px)] object-cover"
              src="https://images.unsplash.com/photo-1503249023995-51b0f3778ccf?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="avatar"
            />
          </div>
          <button className="btn btn-outline btn-primary text-[0.625rem] md:text-xs p-1 h-8 min-h-4 absolute right-4 -bottom-12">
            Edit Profile
          </button>
        </div>
      </div>
      <div className="mt-16 md:mt-24 px-4 w-full">
        <p className="uppercase font-bold">Faizan Shaikh</p>
        <p className="mt-2">@faizanejaz_</p>
        <p className="max-w-[60ch] mt-2 text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis ab
          excepturi quisquam.
        </p>
        <div className="flex flex-col md:flex-row gap-2 md:gap-8 mt-4 text-sm">
          <p>
            <span className="font-bold">21</span> Followers
          </p>
          <p>
            <span className="font-bold">21</span> Followings
          </p>
        </div>
        <p className="text-sm font-bold mt-8">Posts</p>
        <div className="flex flex-col gap-2 mt-4">
          <SingleProfileCard />
        </div>
      </div>

      {/* <div>
        <ul>
          <li>cover image</li>
          <li>avatar</li>
          <li>fullname, username</li>
          <li>email + password (for editing)</li>
          <li>followers</li>
          <li>followings</li>
          <li>pending requests</li>
          <li>posts</li>
        </ul>
      </div> */}
    </div>
  );
}

export default Profile;
