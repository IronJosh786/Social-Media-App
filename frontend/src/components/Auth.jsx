import React from "react";
import Login from "../pages/Login";
import Cookies from "js-cookie";
import { Outlet } from "react-router-dom";

function Auth() {
  let token =
    JSON.parse(localStorage.getItem("isLoggedIn")) ||
    Cookies.get("access_token");
  return token ? <Outlet /> : <Login />;
}

export default Auth;
