import React from "react";
import { useSelector } from "react-redux";

function SingleProfileCard() {
  const { darkMode } = useSelector((state) => state.theme);

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
      style={getBackgroundImageStyle()}
      className="border border-base-300 max-w-full max-h-[300px] sm:max-h-[450px] carousel rounded-box"
    >
      <div className="carousel-item w-full">
        <img
          src="https://images.unsplash.com/photo-1712243754269-35369d9ef28a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8"
          className="w-full object-contain"
          alt="Tailwind CSS Carousel component"
        />
      </div>
      <div className="carousel-item w-full">
        <img
          src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="w-full object-contain"
          alt="Tailwind CSS Carousel component"
        />
      </div>
      <div className="carousel-item w-full">
        <img
          src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8M2QlMjB3YWxscGFwZXJ8ZW58MHwwfDB8fHww"
          className="w-full object-contain"
          alt="Tailwind CSS Carousel component"
        />
      </div>
      <div className="carousel-item w-full">
        <img
          src="https://daisyui.com/images/stock/photo-1494253109108-2e30c049369b.jpg"
          className="w-full object-contain"
          alt="Tailwind CSS Carousel component"
        />
      </div>
      <div className="carousel-item w-full">
        <img
          src="https://daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.jpg"
          className="w-full object-contain"
          alt="Tailwind CSS Carousel component"
        />
      </div>
      <div className="carousel-item w-full">
        <img
          src="https://daisyui.com/images/stock/photo-1559181567-c3190ca9959b.jpg"
          className="w-full object-contain"
          alt="Tailwind CSS Carousel component"
        />
      </div>
      <div className="carousel-item w-full">
        <img
          src="https://daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.jpg"
          className="w-full object-contain"
          alt="Tailwind CSS Carousel component"
        />
      </div>
    </div>
  );
}

export default SingleProfileCard;
