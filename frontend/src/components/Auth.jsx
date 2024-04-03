import React from "react";
import Login from "../pages/Login";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

function Auth() {
  const { isLoggedIn } = useSelector((state) => state.user);
  let token = isLoggedIn || Cookies.get("access_token");
  return token ? <Outlet /> : <Login />;
}

export default Auth;
