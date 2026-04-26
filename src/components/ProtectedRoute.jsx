import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ProtectedRoute = ({ adminOnly = false }) => {
  const userState = useSelector((state) => state.user);

  if (!userState?.userInfo) {
    // Not logged in
    toast.error("PROTOCOL ERROR / AUTHENTICATION REQUIRED");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !userState?.userInfo?.admin) {
    // Logged in but not admin
    toast.error("ACCESS DENIED / INSUFFICIENT PERMISSIONS");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
