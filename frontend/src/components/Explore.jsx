import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios, { all } from "axios";
import { base } from "../baseUrl.js";
import SingleUser from "./SingleUser.jsx";

function Explore() {
  const { darkMode } = useSelector((state) => state.theme);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${base}/api/v1/users/get-all-users`);
      setUsers(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      className={`col-span-12 lg:col-span-6 border-x border-b pb-4 ${
        darkMode ? "border-neutral-700" : "border-base-300"
      }`}
    >
      <div className="grid grid-cols-1 gap-4 p-4 justify-items-center">
        {users.map((user) => (
          <SingleUser key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default Explore;
