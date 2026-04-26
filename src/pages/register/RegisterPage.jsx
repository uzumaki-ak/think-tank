import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from "../../components/MainLayout";
import { signup } from "../../services/index/users";
import { userAction } from "../../store/reducers/userReducers";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user);

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ name, email, password }) => signup({ name, email, password }),
    onSuccess: (data) => {
      dispatch(userAction.setUserInfo(data));
      localStorage.setItem('account', JSON.stringify(data));
      toast.success("IDENTITY INITIALIZED / ACCESS GRANTED");
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (userState.userInfo) navigate('/');
  }, [navigate, userState.userInfo]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const submitHandler = (data) => mutate(data);
  const password = watch('password');

  return (
    <MainLayout>
      <section className="container mx-auto px-6 py-20 min-h-[80vh] flex items-center justify-center animate-in fade-in duration-1000">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 mb-2 block">Identity Management</span>
            <h1 className="font-syne font-extrabold text-5xl uppercase tracking-tighter leading-[0.8]">
              SYSTEM /<br />
              <span className="italic-accent font-normal lowercase tracking-normal">Initialize</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="name" className="font-geist text-[8px] tracking-widest uppercase opacity-30 block ml-1">Node Identity / Name</label>
              <input
                type="text"
                id="name"
                {...register("name", {
                  minLength: { value: 1, message: "IDENTITY TOO SHORT" },
                  required: "IDENTITY REQUIRED",
                })}
                placeholder="FULL LEGAL IDENTITY"
                className={`w-full bg-transparent border-thin p-4 font-ibm text-[11px] tracking-widest uppercase outline-none transition-all placeholder:opacity-10 ${
                  errors.name ? "border-red-500" : "border-black/10 dark:border-white/10 focus:border-black/40 dark:focus:border-white/40"
                }`}
              />
              {errors.name && <p className="font-geist text-[7px] text-red-500 tracking-widest uppercase ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="font-geist text-[8px] tracking-widest uppercase opacity-30 block ml-1">Access Protocol / Email</label>
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
                className={`w-full bg-transparent border-thin p-4 font-ibm text-[11px] tracking-widest uppercase outline-none transition-all placeholder:opacity-10 ${
                  errors.email ? "border-red-500" : "border-black/10 dark:border-white/10 focus:border-black/40 dark:focus:border-white/40"
                }`}
              />
              {errors.email && <p className="font-geist text-[7px] text-red-500 tracking-widest uppercase ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="font-geist text-[8px] tracking-widest uppercase opacity-30 block ml-1">Master Key / Password</label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "MASTER KEY REQUIRED",
                  minLength: { value: 6, message: "KEY STRENGTH INSUFFICIENT" },
                })}
                placeholder="••••••••"
                className={`w-full bg-transparent border-thin p-4 font-ibm text-[11px] tracking-widest outline-none transition-all placeholder:opacity-10 ${
                  errors.password ? "border-red-500" : "border-black/10 dark:border-white/10 focus:border-black/40 dark:focus:border-white/40"
                }`}
              />
              {errors.password && <p className="font-geist text-[7px] text-red-500 tracking-widest uppercase ml-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-1 pb-4">
              <label htmlFor="confirmPassword" className="font-geist text-[8px] tracking-widest uppercase opacity-30 block ml-1">Key Verification</label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "VERIFICATION REQUIRED",
                  validate: (value) => value === password || "KEYS DO NOT MATCH",
                })}
                placeholder="••••••••"
                className={`w-full bg-transparent border-thin p-4 font-ibm text-[11px] tracking-widest outline-none transition-all placeholder:opacity-10 ${
                  errors.confirmPassword ? "border-red-500" : "border-black/10 dark:border-white/10 focus:border-black/40 dark:focus:border-white/40"
                }`}
              />
              {errors.confirmPassword && <p className="font-geist text-[7px] text-red-500 tracking-widest uppercase ml-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full bg-matte-black text-bone dark:bg-bone dark:text-matte-black font-bricolage text-xs tracking-[0.3em] py-6 uppercase hover:opacity-80 disabled:opacity-20 transition-all"
            >
              {isLoading ? "PROCESING DATA..." : "INITIALIZE IDENTITY"}
            </button>

            <div className="pt-8 border-t-thin border-black/5 dark:border-white/5 text-center">
              <p className="font-geist text-[9px] tracking-[0.2em] uppercase opacity-30">
                Existing Node?{" "}
                <Link to="/login" className="opacity-100 underline underline-offset-4 hover:opacity-60 transition-opacity">
                  Access Portal
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default RegisterPage;

