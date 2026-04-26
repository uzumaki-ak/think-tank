import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MainLayout from "../../components/MainLayout";
import { getUserProfile, updateProfile } from "../../services/index/users";
import ProfilePicture from "../../components/profilePicture";
import { userAction } from "../../store/reducers/userReducers";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);

  const {
    data: profileData,
    isLoading: profileIsLoading,
    error: profileError,
  } = useQuery({
    queryFn: () => getUserProfile({ token: userState.userInfo.token }),
    queryKey: ["profile"],
  });

  const { mutate, isLoading: updateProfileIsLoading } = useMutation({
    mutationFn: ({ name, email, password }) => {
      return updateProfile({
        token: userState.userInfo.token,
        userData: { name, email, password },
        userId: userState.userInfo._id,
      });
    },
    onSuccess: (data) => {
      dispatch(userAction.setUserInfo(data));
      localStorage.setItem("account", JSON.stringify(data));
      queryClient.invalidateQueries(["profile"]);
      toast.success("IDENTITY DATA SYNCHRONIZED");
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (!userState.userInfo) navigate("/");
  }, [navigate, userState.userInfo]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { name: "", email: "", password: "" },
    values: useMemo(() => {
      return {
        name: profileIsLoading || !profileData ? "" : profileData.name,
        email: profileIsLoading || !profileData ? "" : profileData.email,
      };
    }, [profileData?.email, profileData?.name, profileIsLoading]),
    mode: "onChange",
  });

  const submitHandler = (data) => mutate(data);

  if (profileIsLoading) return (
    <MainLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <span className="font-ibm text-xs tracking-widest uppercase animate-pulse opacity-40">Polling Identity Data...</span>
      </div>
    </MainLayout>
  );

  if (profileError) return (
    <MainLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <span className="font-ibm text-xs tracking-widest uppercase text-red-500">Synchronization Fault Detected</span>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <section className="container mx-auto px-6 py-20 animate-in fade-in duration-1000">
        <div className="w-full max-w-xl mx-auto">
          {/* Page Header */}
          <div className="mb-16 border-b-thin border-black/10 dark:border-white/10 pb-8">
            <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 mb-2 block">Identity Management / 02</span>
            <h1 className="font-syne font-extrabold text-5xl uppercase tracking-tighter leading-[0.8]">
              CORE<br />
              <span className="italic-accent font-normal lowercase tracking-normal">Modification</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left Col: Avatar Modification */}
            <div className="md:col-span-1">
               <span className="font-geist text-[9px] tracking-widest uppercase opacity-30 block mb-6">Visual Identifier</span>
               <ProfilePicture avatar={profileData?.avatar} />
            </div>

            {/* Right Col: Identity Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit(submitHandler)} className="space-y-8">
                <div className="space-y-2">
                  <label htmlFor="name" className="font-geist text-[9px] tracking-widest uppercase opacity-30 block">
                    Public Identity / Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name", {
                      minLength: { value: 1, message: "IDENTITY TOO SHORT" },
                      required: "IDENTITY REQUIRED",
                    })}
                    placeholder="ENTER NAME"
                    className={`w-full bg-transparent border-thin p-5 font-ibm text-xs tracking-widest uppercase outline-none transition-all placeholder:opacity-10 ${
                      errors.name ? "border-red-500" : "border-black/10 dark:border-white/10 focus:border-black/40 dark:focus:border-white/40"
                    }`}
                  />
                  {errors.name && <p className="font-geist text-[8px] text-red-500 tracking-widest uppercase">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="font-geist text-[9px] tracking-widest uppercase opacity-30 block">
                    Access Protocol / Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "INVALID PROTOCOL FORMAT",
                      },
                      required: "PROTOCOL REQUIRED",
                    })}
                    placeholder="USER@SYSTEM.NET"
                    className={`w-full bg-transparent border-thin p-5 font-ibm text-xs tracking-widest uppercase outline-none transition-all placeholder:opacity-10 ${
                      errors.email ? "border-red-500" : "border-black/10 dark:border-white/10 focus:border-black/40 dark:focus:border-white/40"
                    }`}
                  />
                  {errors.email && <p className="font-geist text-[8px] text-red-500 tracking-widest uppercase">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="font-geist text-[9px] tracking-widest uppercase opacity-30 block">
                    New Security Key / Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register("password")}
                    placeholder="OPTIONAL: ENTER NEW KEY"
                    className={`w-full bg-transparent border-thin p-5 font-ibm text-xs tracking-widest outline-none transition-all placeholder:opacity-10 ${
                      errors.password ? "border-red-500" : "border-black/10 dark:border-white/10 focus:border-black/40 dark:focus:border-white/40"
                    }`}
                  />
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={!isValid || profileIsLoading || updateProfileIsLoading}
                    className="w-full bg-matte-black text-bone dark:bg-bone dark:text-matte-black font-bricolage text-xs tracking-[0.3em] py-6 uppercase hover:opacity-80 disabled:opacity-20 transition-all"
                  >
                    {updateProfileIsLoading ? "SYNCHRONIZING..." : "SYNCHRONIZE CHANGES"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ProfilePage;


