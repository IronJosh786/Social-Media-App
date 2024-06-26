import React from "react";
import { useNavigate } from "react-router-dom";

function SingleConnection({ details, id }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col xs:flex-row xs:items-center lg:flex-col gap-4 justify-between sm:items-center xl:items-start bg-base-300 lg:bg-base-200 p-4 lg:p-2 rounded-box">
      <div className="flex flex-row lg:flex-col xl:flex-row items-center gap-4">
        <img
          src={details.avatar}
          alt="avatar"
          className="h-12 w-12 object-cover rounded-full"
        />
        <div className="text-left lg:text-center xl:text-left overflow-hidden">
          <p className="uppercase overflow-hidden">{details.fullName}</p>
          <p className="font-semibold text-sm overflow-ellipsis">
            @{details.username}
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate(`/user-profile/${id}`)}
        className="btn btn-primary btn-sm lg:btn-xs xl:btn-sm"
      >
        View Profile
      </button>
    </div>
  );
}

export default SingleConnection;
