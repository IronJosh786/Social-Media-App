import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base } from "../baseUrl.js";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { setUserData, toggleLoggedIn } from "../features/userSlice.js";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useSelector((state) => state.theme);
  const { userData } = useSelector((state) => state.user);
  const { isLoggedIn } = useSelector((state) => state.user);
  const isLoginPage = location.pathname.includes("/login");
  const isRegisterPage = location.pathname.includes("/register");
  const [profilePicture, setProfilePicture] = useState(null);

  const changeTheme = () => {
    dispatch(toggleTheme());
  };

  useEffect(() => {
    const html = document.querySelector("html");
    if (darkMode) {
      html.setAttribute("data-theme", "business");
    } else {
      html.setAttribute("data-theme", "corporate");
    }
  }, [darkMode]);

  axios.defaults.withCredentials = true;

  const logout = async () => {
    try {
      const response = await axios.post(`${base}/api/v1/users/logout`);
      toast.success(response.data.message);
      navigate("/login");
      Cookies.remove("access_token");
      dispatch(setUserData(null));
      setProfilePicture(
        "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
      );
      dispatch(toggleLoggedIn(false));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const fetching = async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/users/get-user-profile`,
        { withCredentials: true }
      );
      setProfilePicture(response.data.data.avatar);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetching();
    }
  }, [userData]);

  return (
    <div className="navbar bg-base-100 ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Posts</a>
              <ul className="p-2">
                <li>
                  <a>All</a>
                </li>
                <li>
                  <a>Followings</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl hidden md:flex">SocialSphere</a>
        <a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="flex md:hidden"
            height="36"
            width="36"
          >
            <path
              fill={`${darkMode ? "white" : "black"}`}
              d="M13.0003 21H18.0003V23H6.00032V21H11.0003V19.9506C7.70689 19.6236 4.88351 17.6987 3.31641 14.9622L5.05319 13.9697C6.43208 16.3776 9.02674 18 12.0003 18C16.4186 18 20.0003 14.4182 20.0003 9.99995C20.0003 7.02637 18.378 4.43171 15.9701 3.05282L16.9626 1.31604C19.9724 3.03965 22.0003 6.28297 22.0003 9.99995C22.0003 15.1853 18.0536 19.4489 13.0003 19.9506V21ZM12.0003 17C8.13433 17 5.00032 13.8659 5.00032 9.99995C5.00032 6.13396 8.13433 2.99995 12.0003 2.99995C15.8663 2.99995 19.0003 6.13396 19.0003 9.99995C19.0003 13.8659 15.8663 17 12.0003 17Z"
            ></path>
          </svg>
        </a>
      </div>
      {!isLoginPage && !isRegisterPage && (
        <div className="navbar-center hidden lg:flex">
          <div className="flex flex-col w-full">
            <div className="grid rounded-box place-items-center">Posts</div>
            <div className="divider my-0"></div>
            <div className="grid rounded-box place-items-center">
              <ul className="menu menu-horizontal p-0 mt-0 flex gap-4">
                <li className="bg-base-300 rounded-box flex items-center justify-center">
                  <a className="rounded-box py-1 px-8">All</a>
                </li>
                <li className="bg-base-300 rounded-box flex items-center justify-center">
                  <a className="rounded-box py-1 px-8">Follwings</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full bg-accent">
              <img
                alt="profile picture"
                src={
                  profilePicture ||
                  "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                }
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-28 sm:w-40 items-center"
          >
            <li className="w-full flex lg:hidden">
              <a className="flex justify-center">Profile</a>
            </li>
            <li className="w-full flex lg:hidden">
              <a className="flex justify-center">Bookmarks</a>
            </li>
            <li onClick={logout} className="w-full">
              <a className="flex justify-center">Logout</a>
            </li>
            <div className="divider my-0"></div>
            <li className="w-full">
              <div onClick={changeTheme} className="flex justify-center">
                {darkMode ? (
                  <i className="ri-sun-line "></i>
                ) : (
                  <i className="ri-moon-line "></i>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
