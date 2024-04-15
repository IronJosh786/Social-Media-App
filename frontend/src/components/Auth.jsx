import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { getLocalStorage } from "../localStorage";
function Auth() {
  const token = getLocalStorage("isLoggedIn");
  return token ? <Outlet /> : <Navigate to={"/"} replace />;
}

export default Auth;
