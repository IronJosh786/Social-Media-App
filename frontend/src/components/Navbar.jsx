import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeSlice.js";

function Navbar() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);

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

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <NavLink to={"/"} className="btn btn-ghost font-bold text-3xl">
          SocialSphere
        </NavLink>
      </div>
      <div className="flex-none">
        {darkMode ? (
          <button onClick={changeTheme}>
            <i className="ri-sun-line btn btn-square btn-ghost text-2xl"></i>
          </button>
        ) : (
          <button onClick={changeTheme}>
            <i className="ri-moon-line btn btn-square btn-ghost text-2xl"></i>
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
