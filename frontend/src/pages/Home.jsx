import React from "react";
import Leftbar from "../components/Leftbar";
import Rightbar from "../components/Rightbar";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <div className="bg-base-200 grow">
      <div className="max-w-[80%] mx-auto grid grid-cols-12">
        <Leftbar />
        <Outlet />
        <Rightbar />
      </div>
    </div>
  );
}

export default Home;
