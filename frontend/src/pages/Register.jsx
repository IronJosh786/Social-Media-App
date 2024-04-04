import axios from "axios";
import { toast } from "sonner";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { base } from "../baseUrl.js";

function Register() {
  const [data, setData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userDetails = {
      fullName: data.fullName,
      email: data.email,
      username: data.username,
      password: data.password,
    };
    try {
      const response = await axios.post(
        `${base}/api/v1/users/register`,
        userDetails
      );
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="hero grow bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-4xl font-bold">Register now!</h1>
          <p className="py-6 max-w-[60ch]">
            Ready to join SocialSphere? Register now and start connecting!
          </p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleSubmit} className="card-body p-2 md:p-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered"
                id="fullName"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered"
                id="email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered"
                id="username"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered"
                id="password"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
            <label className="label text-center">
              <p className="label-text-alt">
                Already have an account?
                <NavLink
                  to={"/login"}
                  className={"link link-hover underline-offset-2"}
                >
                  {" "}
                  Login
                </NavLink>
              </p>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
