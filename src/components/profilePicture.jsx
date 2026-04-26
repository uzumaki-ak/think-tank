import React, { useState } from "react";
import { createPortal } from "react-dom";
import { stables } from "../constants";
import CropEasy from "./crop/CropEasy";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateProfilePicture } from "../services/index/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userAction } from "../store/reducers/userReducers";

const ProfilePicture = ({ avatar }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const [openCrop, setOpenCrop] = useState(false);
  const [photo, setPhoto] = useState(null);

  const { mutate } = useMutation({
    mutationFn: ({ token, formData }) => {
      return updateProfilePicture({ token, formData });
    },
    onSuccess: (data) => {
      dispatch(userAction.setUserInfo(data));
      setOpenCrop(false);
      localStorage.setItem("account", JSON.stringify(data));
      queryClient.invalidateQueries(["profile"]);
      toast.success("IDENTIFIER EXPUNGED");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto({ url: URL.createObjectURL(file), file });
      setOpenCrop(true);
    }
  };

  const handleDeleteImage = () => {
    if (window.confirm("CONFIRM DELETION OF VISUAL IDENTIFIER?")) {
      try {
        const formData = new FormData();
        formData.append("profilePicture", undefined);
        mutate({ token: userState.userInfo.token, formData: formData });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      {openCrop && createPortal(
        <CropEasy photo={photo} setOpenCrop={setOpenCrop} />,
        document.getElementById("portal")
      )}

      <div className="flex flex-col gap-6">
        <div className="relative w-32 h-32 group border-thin border-black/10 dark:border-white/10 overflow-hidden bg-black/5 dark:bg-white/5">
          <label
            htmlFor="profilePicture"
            className="cursor-pointer absolute inset-0 z-10 flex items-center justify-center bg-matte-black/0 group-hover:bg-matte-black/40 transition-all duration-500"
          >
            <span className="font-geist text-[8px] tracking-widest uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity">
              [Modify]
            </span>
            {avatar ? (
              <img
                src={avatar.startsWith("http") ? avatar : stables.UPLOAD_FOLDER_BASE_URL + avatar}
                alt="profile node"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center opacity-20">
                <span className="font-ibm text-[10px] tracking-tighter">[X]</span>
                <span className="font-geist text-[7px] tracking-widest uppercase mt-2">No Data</span>
              </div>
            )}
          </label>
          <input
            type="file"
            className="sr-only"
            id="profilePicture"
            onChange={handleFileChange}
          />
        </div>
        <button
          onClick={handleDeleteImage}
          type="button"
          className="font-geist text-[9px] tracking-[0.2em] uppercase text-red-500 opacity-40 hover:opacity-100 transition-opacity text-left"
        >
          [Expunge Image]
        </button>
      </div>
    </>
  );
};

export default ProfilePicture;