import React from "react";
import { useSelector } from "react-redux";

function Search() {
  const { darkMode } = useSelector((state) => state.theme);
  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b px-4 py-0 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <h3 className="py-4 text-xl font-bold">Search</h3>
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-full pr-8"
        />
        <button className="absolute right-2 bottom-1/2 transform translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-5 h-5 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Search;
