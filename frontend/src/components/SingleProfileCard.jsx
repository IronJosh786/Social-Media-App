import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SingleProfileCard({ post }) {
  const { darkMode } = useSelector((state) => state.theme);
  const navigate = useNavigate();

  const getBackgroundImageStyle = () => {
    const strokeColor = darkMode
      ? "rgb(255 255 255 / 0.2)"
      : "rgb(0 0 0 / 0.2)";
    return {
      backgroundImage: `url('data:image/svg+xml,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22 width=%228%22 height=%228%22 fill=%22none%22 stroke=%22${strokeColor}%22%3e%3cpath d=%22M0%20.5H31.5V32%22/%3e%3c/svg%3e')`,
    };
  };
  return (
    <div
      onClick={() => navigate(`/detailedPost/${post._id}`)}
      key={post._id}
      style={getBackgroundImageStyle()}
      className="hover:cursor-pointer border border-base-300 max-w-full max-h-[300px] sm:max-h-[450px] carousel rounded-box"
    >
      {post.images.map((path) => {
        const parts = path.split("/");
        const uniqueKey = parts[parts.length - 1].split(".")[0];
        return (
          <div key={uniqueKey} className="carousel-item w-full">
            <img
              src={path}
              className="w-full h-full object-contain"
              alt="post image"
            />
          </div>
        );
      })}
    </div>
  );
}

export default SingleProfileCard;
