import React, { useEffect } from "react";
import Header from "./components/header/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../services/index/users";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);

  const {
    data: profileData,
    isLoading: profileIsLoading,
  } = useQuery({
    queryFn: () => getUserProfile({ token: userState?.userInfo?.token }),
    queryKey: ["profile"],
    enabled: !!userState?.userInfo?.token,
  });

  useEffect(() => {
    if (!profileIsLoading && (!profileData || !profileData?.admin)) {
      navigate("/");
      if (!profileData) toast.error("ACCESS DENIED / AUTHENTICATION REQUIRED");
      else toast.error("ACCESS DENIED / INSUFFICIENT PERMISSIONS");
    }
  }, [profileData, profileIsLoading, navigate]);

  if (profileIsLoading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center bg-bone dark:bg-matte-black transition-colors duration-500">
        <span className="font-ibm text-[10px] tracking-[0.4em] uppercase opacity-40 mb-4 animate-pulse">Initializing System</span>
        <h3 className="font-syne font-bold text-2xl uppercase tracking-tighter animate-pulse">ARCHIVE.ACCESS</h3>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden lg:flex-row bg-bone dark:bg-matte-black transition-colors duration-500">
      <div className="lg:h-screen lg:w-[280px] lg:shrink-0 border-r-thin border-black/10 dark:border-white/10">
        <Header />
      </div>
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
        {/* Grain Overlay for Admin */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

