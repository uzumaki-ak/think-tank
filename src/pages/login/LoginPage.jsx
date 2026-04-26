import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../components/MainLayout";
import { login } from "../../services/index/users";
import { userAction } from "../../store/reducers/userReducers";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ email, password }) => login({ email, password }),
    onSuccess: (data) => {
      dispatch(userAction.setUserInfo(data));
      localStorage.setItem("account", JSON.stringify(data));
      toast.success("ACCESS GRANTED / SESSION INITIALIZED");
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (userState.userInfo) navigate("/");
  }, [navigate, userState.userInfo]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const submitHandler = (data) => mutate(data);

  return (
    <MainLayout>
      <section className="container mx-auto px-6 py-20 min-h-[80vh] flex items-center justify-center animate-in fade-in duration-1000">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 mb-2 block">System Gateway</span>
            <h1 className="font-syne font-extrabold text-5xl uppercase tracking-tighter leading-[0.8]">
              IDENTIFY<br />
              <span className="italic-accent font-normal lowercase tracking-normal">Access</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-8">
            <div className="space-y-2">
              <label htmlFor="email" className="font-geist text-[9px] tracking-widest uppercase opacity-30 block">
                Identification / Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  pattern: {
                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "INVALID IDENTIFICATION FORMAT",
                  },
                  required: "IDENTIFICATION REQUIRED",
                })}
                placeholder="USER@SYSTEM.NET"
                className={`w-full bg-transparent border-thin p-5 font-ibm text-xs tracking-widest uppercase outline-none transition-all placeholder:opacity-10 ${
                  errors.email ? "border-red-500" : "border-black/10 dark:border-white/10 focus:border-black/40 dark:focus:border-white/40"
                }`}
              />
              {errors.email && (
                <p className="font-geist text-[8px] text-red-500 tracking-widest uppercase">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label htmlFor="password" className="font-geist text-[9px] tracking-widest uppercase opacity-30 block">
                  Security Key / Password
                </label>
                <Link to="/forget-password" title="Initiate Key Recovery" className="font-geist text-[8px] tracking-widest uppercase opacity-20 hover:opacity-100 transition-opacity">
                  [RECOVER KEY]
                </Link>
              </div>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "SECURITY KEY REQUIRED",
                  minLength: { value: 6, message: "KEY LENGTH INSUFFICIENT" },
                })}
                placeholder="••••••••"
                className={`w-full bg-transparent border-thin p-5 font-ibm text-xs tracking-widest outline-none transition-all placeholder:opacity-10 ${
                  errors.password ? "border-red-500" : "border-black/10 dark:border-white/10 focus:border-black/40 dark:focus:border-white/40"
                }`}
              />
              {errors.password && (
                <p className="font-geist text-[8px] text-red-500 tracking-widest uppercase">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full bg-matte-black text-bone dark:bg-bone dark:text-matte-black font-bricolage text-xs tracking-[0.3em] py-6 uppercase hover:opacity-80 disabled:opacity-20 transition-all"
            >
              {isLoading ? "ESTABLISHING LINK..." : "AUTHENTICATE"}
            </button>

            <div className="mt-12 p-6 border-thin border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
              <span className="font-geist text-[8px] tracking-[0.4em] uppercase opacity-30 block mb-4">System Access Protocol / Guest Admin</span>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-ibm text-[9px] uppercase opacity-40">Identifier:</span>
                  <span className="font-ibm text-[9px] uppercase tracking-wider">ichigoroy107@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-ibm text-[9px] uppercase opacity-40">Passkey:</span>
                  <span className="font-ibm text-[9px] uppercase tracking-wider">123456</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t-thin border-black/5 dark:border-white/5 text-center">
              <p className="font-geist text-[9px] tracking-[0.2em] uppercase opacity-30">
                Unregistered Node?{" "}
                <Link to="/register" className="opacity-100 underline underline-offset-4 hover:opacity-60 transition-opacity">
                  Create Identity
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default LoginPage;

