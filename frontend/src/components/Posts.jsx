import React from "react";

function MainContent() {
  return (
    <div className="col-span-12 md:col-span-6 p-4 border-x-2 border-base-300">
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
