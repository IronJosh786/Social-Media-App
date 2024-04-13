import React from "react";
import { useSelector } from "react-redux";

function Search() {
  const { darkMode } = useSelector((state) => state.theme);
  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b pb-4 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <h3 className="p-4 text-xl font-bold ">Search</h3>
    </div>
  );
}

export default Search;
