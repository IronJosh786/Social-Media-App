import React from "react";

function Rightbar() {
  return (
    <div className="hidden md:block md:col-span-3 p-4">
      <div>
        <ul>
          <li>search</li>
          <li>pending requests</li>
          <li>new users</li>
        </ul>
      </div>
    </div>
  );
}

export default Rightbar;
