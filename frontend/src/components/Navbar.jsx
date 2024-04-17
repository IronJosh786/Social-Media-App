import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "../axios.js";
import { base } from "../baseUrl.js";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { setUserData, toggleLoggedIn } from "../features/userSlice.js";
import { getLocalStorage } from "../localStorage.js";

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
      navigate("/");
      Cookies.remove("access_token");
      dispatch(setUserData(null));
      setProfilePicture(
        "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
      );
      dispatch(toggleLoggedIn(false));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetching = async () => {
    try {
      const response = await axios.get(`${base}/api/v1/users/get-user-profile`);
      setProfilePicture(response.data.data.avatar);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const checkAuthenticationStatus = () => {
    const token = getLocalStorage("isLoggedIn");
    if (!token) {
      dispatch(toggleLoggedIn(false));
    }
  };

  useEffect(() => {
    checkAuthenticationStatus();
    const intervalId = setInterval(checkAuthenticationStatus, 5 * 60 * 1000);
    if (isLoggedIn) {
      fetching();
    }
    return () => clearInterval(intervalId);
  }, [userData, isLoggedIn]);

  return (
    <div className="navbar bg-base-100 ">
      <div className="navbar-start">
        <NavLink to={"/"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="flex"
            height="36"
            width="36"
          >
            <path
              fill={`${darkMode ? "white" : "black"}`}
              d="M13.0003 21H18.0003V23H6.00032V21H11.0003V19.9506C7.70689 19.6236 4.88351 17.6987 3.31641 14.9622L5.05319 13.9697C6.43208 16.3776 9.02674 18 12.0003 18C16.4186 18 20.0003 14.4182 20.0003 9.99995C20.0003 7.02637 18.378 4.43171 15.9701 3.05282L16.9626 1.31604C19.9724 3.03965 22.0003 6.28297 22.0003 9.99995C22.0003 15.1853 18.0536 19.4489 13.0003 19.9506V21ZM12.0003 17C8.13433 17 5.00032 13.8659 5.00032 9.99995C5.00032 6.13396 8.13433 2.99995 12.0003 2.99995C15.8663 2.99995 19.0003 6.13396 19.0003 9.99995C19.0003 13.8659 15.8663 17 12.0003 17Z"
            ></path>
          </svg>
        </NavLink>
        <NavLink to={"/"} className="btn btn-ghost text-2xl hidden md:flex">
          SocialSphere
        </NavLink>
      </div>
      <div className="navbar-end">
        {!isLoggedIn && !isLoginPage && !isRegisterPage && (
          <div className="flex gap-4 px-4">
            <NavLink
              to={"/register"}
              className={`btn btn-outline h-8 min-h-4 text-[0.7rem] p-2 sm:text-base sm:h-10 sm:min-h-10`}
            >
              Register
            </NavLink>
            <NavLink
              to={"/login"}
              className={`btn btn-primary h-8 min-h-4 text-[0.7rem] p-2 sm:text-base sm:h-10 sm:min-h-10`}
            >
              Login
            </NavLink>
          </div>
        )}
        {isLoggedIn && (
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
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40 items-center"
            >
              <li className="w-full flex lg:hidden">
                <NavLink to={"/profile"} className="flex justify-center">
                  Profile
                </NavLink>
              </li>
              <li className="w-full flex lg:hidden">
                <NavLink to={"/bookmarks"} className="flex justify-center">
                  Bookmarks
                </NavLink>
              </li>
              <li onClick={logout} className="w-full">
                <a className="flex justify-center">Logout</a>
              </li>
              <div className="divider my-0"></div>
              <li className="w-full">
                <div onClick={changeTheme} className="flex justify-center">
                  {darkMode ? (
                    <i className="ri-sun-foggy-line"></i>
                  ) : (
                    <i className="ri-moon-foggy-line"></i>
                  )}
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
