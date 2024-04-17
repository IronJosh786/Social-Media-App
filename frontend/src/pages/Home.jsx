import React, { useState } from "react";
import Leftbar from "../components/Leftbar";
import Rightbar from "../components/Rightbar";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { base } from "../baseUrl.js";
import { toast } from "sonner";
import { useSelector } from "react-redux";

function Home() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [bio, setBio] = useState("");
  const { isLoggedIn } = useSelector((state) => state.user);

  axios.defaults.withCredentials = true;

  const handleFileChange = (e) => {
    const files = e.target.files;
    const selected = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      selected.push(file);
    }

    setSelectedImages(selected);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    if (!bio || !bio.trim() || !selectedImages) {
      toast.error("Both fields are required");
      return;
    }

    let formData = new FormData();
    formData.append("caption", bio);
    selectedImages.forEach((image) => {
      formData.append("photos", image);
    });

    const id = toast.loading("Processing...");
    try {
      const response = await axios.post(
        `${base}/api/v1/post/new-post`,
        formData
      );
      toast.success("Published a new post");
      window.location.reload();
      setBio("");
      setSelectedImages([]);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      toast.dismiss(id);
    }
  };

  const openModal = () => {
    document.getElementById("my_modal_0").showModal();
  };

  return (
    <div className="bg-base-200 grow">
      <dialog id="my_modal_0" className="modal modal-middle">
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        <div className="modal-box">
          <form
            method="dialog"
            onSubmit={handleFormSubmit}
            className="card-body grid grid-cols-1 p-2 md:p-4"
          >
            <h3 className="font-bold text-xl mb-4">New Post</h3>
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Choose Images</span>
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
              />
              <p className="mt-2 label-text px-1 text-red-500">
                <span className={`text-base-content`}>Limit:</span> 5 images,{" "}
                <span className={`text-base-content`}>Max Size:</span> 3 Mb,{" "}
                <span className={`text-base-content`}>Allowed:</span> jpeg, jpg,
                png, webp
              </p>
            </div>
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Caption</span>
              </label>
              <input
                type="text"
                placeholder="Caption"
                className="input input-bordered"
                id="caption"
                value={bio}
                onChange={handleBioChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="mt-6 btn hidden lg:flex">Esc to close</div>
              <div className="mt-6 btn lg:hidden">Click outside to close</div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
      </dialog>
      <div className="w-full sm:max-w-[65%] lg:max-w-[85%] mx-auto grid grid-cols-12">
        <Leftbar />
        <Outlet />
        <Rightbar />
        <button
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className="btn btn-outline rounded-full fixed left-4 sm:left-12 bottom-12"
        >
          <i className="ri-arrow-up-wide-line"></i>
        </button>
        <div className="btm-nav btm-nav-xs lg:hidden">
          <button>
            <NavLink to={"/"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20ZM19 19V9.97815L12 4.53371L5 9.97815V19H19Z"></path>
              </svg>
            </NavLink>
          </button>
          {isLoggedIn && (
            <button>
              <NavLink to={"/pending-requests"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14 14.252V16.3414C13.3744 16.1203 12.7013 16 12 16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM20 17H23V19H20V22.5L15 18L20 13.5V17Z"></path>
                </svg>
              </NavLink>
            </button>
          )}
          <button onClick={openModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path>
            </svg>
          </button>
          <button>
            <NavLink to={"/search"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
              </svg>
            </NavLink>
          </button>
          <button>
            <NavLink to={"/explore"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.23509 6.45329C4.85101 7.89148 4 9.84636 4 12C4 16.4183 7.58172 20 12 20C13.0808 20 14.1116 19.7857 15.0521 19.3972C15.1671 18.6467 14.9148 17.9266 14.8116 17.6746C14.582 17.115 13.8241 16.1582 12.5589 14.8308C12.2212 14.4758 12.2429 14.2035 12.3636 13.3943L12.3775 13.3029C12.4595 12.7486 12.5971 12.4209 14.4622 12.1248C15.4097 11.9746 15.6589 12.3533 16.0043 12.8777C16.0425 12.9358 16.0807 12.9928 16.1198 13.0499C16.4479 13.5297 16.691 13.6394 17.0582 13.8064C17.2227 13.881 17.428 13.9751 17.7031 14.1314C18.3551 14.504 18.3551 14.9247 18.3551 15.8472V15.9518C18.3551 16.3434 18.3168 16.6872 18.2566 16.9859C19.3478 15.6185 20 13.8854 20 12C20 8.70089 18.003 5.8682 15.1519 4.64482C14.5987 5.01813 13.8398 5.54726 13.575 5.91C13.4396 6.09538 13.2482 7.04166 12.6257 7.11976C12.4626 7.14023 12.2438 7.12589 12.012 7.11097C11.3905 7.07058 10.5402 7.01606 10.268 7.75495C10.0952 8.2232 10.0648 9.49445 10.6239 10.1543C10.7134 10.2597 10.7307 10.4547 10.6699 10.6735C10.59 10.9608 10.4286 11.1356 10.3783 11.1717C10.2819 11.1163 10.0896 10.8931 9.95938 10.7412C9.64554 10.3765 9.25405 9.92233 8.74797 9.78176C8.56395 9.73083 8.36166 9.68867 8.16548 9.64736C7.6164 9.53227 6.99443 9.40134 6.84992 9.09302C6.74442 8.8672 6.74488 8.55621 6.74529 8.22764C6.74529 7.8112 6.74529 7.34029 6.54129 6.88256C6.46246 6.70541 6.35689 6.56446 6.23509 6.45329ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z"></path>
              </svg>
            </NavLink>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
