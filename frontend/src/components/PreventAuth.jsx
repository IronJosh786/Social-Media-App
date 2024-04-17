import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { getLocalStorage } from "../localStorage";
function PreventAuth() {
  const token = getLocalStorage("isLoggedIn");
  return token ? <Navigate to={"/"} replace /> : <Outlet />;
}

export default PreventAuth;
