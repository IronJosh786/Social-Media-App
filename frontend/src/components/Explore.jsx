import React from "react";
import { useSelector } from "react-redux";

function Explore() {
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b pb-4 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      Explore
    </div>
  );
}

export default Explore;
