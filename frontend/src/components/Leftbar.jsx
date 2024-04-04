import React from "react";

function Leftbar() {
  return (
    <div className="hidden md:block md:col-span-3 p-4">
      <div>
        <ul>
          <li>profile</li>
          <li>bookmarks</li>
          <li>explore</li>
          <li>new post</li>
        </ul>
      </div>
    </div>
  );
}

export default Leftbar;
