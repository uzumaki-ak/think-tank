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

  const { mutate, isloading } = useMutation({
    mutationFn: ({ email, password }) => {
      return login({ email, password });
    },
    onSuccess: (data) => {
      dispatch(userAction.setUserInfo(data));
      //saving the user in local so user dont have to login if page refreshes
      localStorage.setItem("account", JSON.stringify(data));
    },
    onError: (error) => {
      toast.error(error.message);

      console.log(error);
    },
  });

  useEffect(() => {
    //if user is not logged in then redirect user to home page
    if (userState.userInfo) {
      navigate("/");
    }
  }, [navigate, userState.userInfo]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const submitHandler = (data) => {
    const { email, password } = data;
    mutate({ email, password });
  };

  return (
    <div>
      <MainLayout>
        <section className="container mx-auto px-5 py-10">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="font-rob text-2xl text-dark-hard mb-8 flex justify-center font-bold">
              Login
            </h1>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="flex flex-col mb-6 w-full">
                <label
                  htmlFor="email"
                  className="text-[#5a7184] font-semibold block"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email address",
                    },
                    required: {
                      value: true,
                      message: "Email is required",
                    },
                  })}
                  placeholder="Enter Email"
                  className={`placeholder:text-[#959ead] text-dark-hard mb-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${
                    errors.email ? "border-[#fa2121]" : "border-[#c3cad9]"
                  }`}
                />
                {errors.email?.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col mb-6 w-full">
                <label
                  htmlFor="password"
                  className="text-[#5a7184] font-semibold block"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                    minLength: {
                      value: 6,
                      message: "Password should have at least 6 characters",
                    },
                  })}
                  placeholder="Enter password"
                  className={`placeholder:text-[#959ead] text-dark-hard mb-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${
                    errors.password ? "border-[#fa2121]" : "border-[#c3cad9]"
                  }`}
                />
                {errors.password?.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password?.message}
                  </p>
                )}
              </div>
              <Link
                to="/forget-password"
                className="text-sm font-semibold text-primary"
              >
                Forgot Passowrd?
              </Link>
              <button
                type="submit"
                disabled={!isValid || isloading}
                className="bg-primary text-white font-bold text-lg py-4 px-8 w-full rounded-lg my-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Sign In
              </button>
              <p className="text-sm font-semibold text-[#5a7184]">
              Do Not have an account?{" "}
                <Link to="/register" className="text-primary">
                 Register Now
                </Link>
              </p>
            </form>
          </div>
        </section>
      </MainLayout>
    </div>
  );
};

export default LoginPage;
