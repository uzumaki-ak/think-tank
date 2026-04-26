import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";
import { RiMoonLine, RiSunLine } from "react-icons/ri";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
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
    return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
  });

  const { mutate: mutateCreatePost, isLoading: isLoadingCreatePost } = useMutation({
    mutationFn: ({ token }) => createPost({ token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("ENTRY CREATED / PROCEED TO EDIT");
      navigate(`/admin/posts/manage/edit/${data.slug}`);
    },
    onError: (error) => toast.error(error.message),
  });

  const toggleMenuHandler = () => setIsMenuActive((prev) => !prev);

  useEffect(() => {
    setIsMenuActive(windowSize.width >= 1024);
  }, [windowSize.width]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <header className="flex w-full items-center justify-between p-6 lg:h-full lg:max-w-[320px] lg:flex-col lg:items-start lg:justify-start lg:p-12 bg-bone dark:bg-matte-black transition-colors duration-500 border-r-thin border-black/5 dark:border-white/5">
      {/* Architectural Logo Sync */}
      <Link to="/" className="flex items-center gap-4 group">
          <div className="relative w-8 h-8 border-[1.5px] border-black dark:border-white flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-black/10 dark:bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="relative z-10">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
             </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-syne font-extrabold text-lg leading-none tracking-tighter uppercase">
              Think<span className="italic-accent font-normal lowercase tracking-normal text-sm">Tank</span>
            </span>
          </div>
      </Link>

      <div className="cursor-pointer lg:hidden">
        {isMenuActive ? <AiOutlineClose onClick={toggleMenuHandler} /> : <AiOutlineMenu onClick={toggleMenuHandler} />}
      </div>

      {isMenuActive && (
        <div className="fixed inset-0 z-[100] lg:static lg:h-full lg:w-full">
          <div className="fixed inset-0 bg-matte-black/60 lg:hidden" onClick={toggleMenuHandler} />
          
          <div className="fixed top-0 bottom-0 left-0 w-3/4 bg-bone dark:bg-matte-black p-10 lg:static lg:h-full lg:w-full lg:p-0 lg:mt-16 overflow-y-auto">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center justify-between border-thin border-black/10 dark:border-white/10 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              <span className="font-geist text-[8px] tracking-[0.3em] uppercase opacity-40">System Mode</span>
              {isDarkMode ? <RiSunLine className="h-3 w-3" /> : <RiMoonLine className="h-3 w-3" />}
            </button>

            <h4 className="mt-16 font-geist text-[8px] tracking-[0.4em] uppercase opacity-30 mb-8">Navigation Hub</h4>
            
            <div className="flex flex-col gap-y-1">
              <NavItem
                title="Master Dashboard"
                link="/admin"
                name="dashboard"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />
              
              <NavItemCollapse
                title="Intelligence"
                name="intelligence"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              >
                <div className="flex flex-col gap-4 pl-4 mt-4 border-l-thin border-black/10 dark:border-white/10">
                  <NavItem title="Communication" link="/admin/comments" name="comments" activeNavName={activeNavName} setActiveNavName={setActiveNavName} />
                  <NavItem title="Briefing [AI]" link="/admin" name="ai-brief" activeNavName={activeNavName} setActiveNavName={setActiveNavName} />
                  <NavItem title="Subscribers" link="/admin" name="subscribers" activeNavName={activeNavName} setActiveNavName={setActiveNavName} />
                </div>
              </NavItemCollapse>

              <NavItemCollapse
                title="Archives"
                name="posts"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              >
                <div className="flex flex-col gap-4 pl-4 mt-4 border-l-thin border-black/10 dark:border-white/10">
                  <Link to="/admin/posts/manage" className="font-bricolage text-[10px] uppercase tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity">Inventory</Link>
                  <button
                    disabled={isLoadingCreatePost}
                    className="text-left font-bricolage text-[10px] uppercase tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity disabled:opacity-20"
                    onClick={() => mutateCreatePost({ token: userState.userInfo.token })}
                  >
                    New Entry
                  </button>
                  <Link to="/admin/categories/manage" className="font-bricolage text-[10px] uppercase tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity">Categories</Link>
                </div>
              </NavItemCollapse>

              <NavItem
                title="Network Nodes"
                link="/admin/users/manage"
                name="users"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />
              <NavItem
                title="Key Exchange"
                link="/admin/settings/api-key"
                name="api-key"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />
            </div>

            <div className="mt-auto pt-20 hidden lg:block">
              <span className="font-ibm text-[8px] tracking-[0.3em] uppercase opacity-20 block mb-2">v.01.2026 / Stable</span>
              <span className="font-ibm text-[8px] tracking-[0.3em] uppercase opacity-20 block">Design for Discipline</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

