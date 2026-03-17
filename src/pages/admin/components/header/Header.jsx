import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";

import { images } from "../../../../constants";
import {
  AiFillDashboard,
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineKey,
} from "react-icons/ai";
import { FaComments, FaUser } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { RiMoonLine, RiSunLine } from "react-icons/ri";
import NavItem from "./NavItem";
import NavItemCollapse from "./NavItemCollapse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { createPost } from "../../../../services/index/posts";

const Header = () => {
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [activeNavName, setActiveNavName] = useState("dashboard");
  const windowSize = useWindowSize();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark"
    );
  });

  const { mutate: mutateCreatePost, isloading: isLoadingCreatePost } =
    useMutation({
      mutationFn: ({ slug, token }) => {
        return createPost({
          token,
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["posts"]);
        toast.success("Post created :>, edit that now");
       navigate(`/admin/posts/manage/edit/${data.slug}`)
      },
      onError: (error) => {
        toast.error(error.message);

        console.log(error);
      },
    });

  const toggleMenuHandler = () => {
    setIsMenuActive((prevState) => !prevState);
  };

  useEffect(() => {
    if (windowSize.width < 1024) {
      setIsMenuActive(false);
    } else {
      setIsMenuActive(true);
    }
  }, [windowSize.width]);

  const handleCreateNewPost = ({ token }) => {
    mutateCreatePost({ token });
  };

  const toggleTheme = () => {
    setIsDarkMode((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return nextState;
    });
  };

  return (
    <header className="flex w-full items-center justify-between p-4 lg:h-full lg:max-w-[300px] lg:flex-col lg:items-start lg:justify-start lg:p-0">
      {/* logo  */}
      <Link to="/">
        <img src={images.logo} alt="logo" className="w-16 lg:hidden" />
      </Link>
      {/* menuberg icon  */}
      <div className="cursor-pointer lg:hidden">
        {isMenuActive ? (
          <AiOutlineClose className="w-6 h-6" onClick={toggleMenuHandler} />
        ) : (
          <AiOutlineMenu className="w-6 h-6" onClick={toggleMenuHandler} />
        )}
      </div>
      {/* sidebarcontainer  */}
      {isMenuActive && (
        <div className="fixed inset-0 lg:static lg:h-full lg:w-full">
          {/* underlay  */}
          <div
            className="fixed inset-0 bg-black/50 lg:hidden"
            onClick={toggleMenuHandler}
          />
          {/* sidebar  */}
          <div className="fixed top-0 bottom-0 left-0 z-50 w-3/4 overflow-y-auto bg-white p-4 lg:static lg:h-full lg:w-full lg:overflow-y-auto lg:p-6">
            <Link to="/">
              <img src={images.logo} alt="logo" className="w-16" />
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="mt-6 flex w-full items-center justify-between rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-dark-soft transition hover:border-dark-soft"
              aria-label="Toggle dark mode"
            >
              <span>Theme</span>
              {isDarkMode ? (
                <RiSunLine className="h-4 w-4" />
              ) : (
                <RiMoonLine className="h-4 w-4" />
              )}
            </button>
            <h4 className="mt-10 font-bold text-[#c7c7c7]">MAIN MENU</h4>
            {/* menu items  */}
            <div className="mt-6 flex flex-col gap-y-[0.563rem]">
              <NavItem
                title="Dashboard"
                link="/admin"
                icon={<AiFillDashboard className="text-xl " />}
                name="dashboard"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />
              <NavItem
                title="Comments"
                link="/admin/comments"
                icon={<FaComments className="text-xl " />}
                name="comments"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />

              <NavItemCollapse
                title="Posts"
                icon={<MdDashboard className="text-xl " />}
                name="posts"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              >
                <Link to="/admin/posts/manage">Manage all Posts</Link>
                <button
                disabled={isLoadingCreatePost}
                  className="text-start disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() =>
                    handleCreateNewPost({ token: userState.userInfo.token })
                  }
                >
                  Add New Post
                </button>
                <Link to="/admin/categories/manage">Categories</Link>
              </NavItemCollapse>

              <NavItem
                title="Users"
                link="/admin/users/manage"
                icon={<FaUser className="text-xl " />}
                name="users"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />
              <NavItem
                title="API Key"
                link="/admin/settings/api-key"
                icon={<AiOutlineKey className="text-xl " />}
                name="api-key"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
