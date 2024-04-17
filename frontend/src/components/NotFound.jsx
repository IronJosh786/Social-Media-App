import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(timer);
      navigate("/");
    }

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Page Not Found (404)</h1>
          <span className="countdown">
            You will be back to home page in: {countdown}
          </span>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
