import React from "react";
import { useSelector } from "react-redux";

function MainContent() {
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b pb-4 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <div>
        <ul>
          <li className="md:hidden">search</li>
          <li>posts</li>
          <li className="md:hidden">new post overlay</li>
        </ul>
      </div>
    </div>
  );
}

export default MainContent;
