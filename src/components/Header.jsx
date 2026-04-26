import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { RiArrowDownSLine, RiMoonLine, RiSunLine } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { logout } from "../store/actions/user";
import { images, stables } from "../constants";

const navItemsInfo = [
  { name: "ARCHIVE", type: "link", href: "/blog" },
  {
    name: "EDITION",
    type: "dropdown",
    items: [
      { title: "ABOUT SYSTEM", href: "/about" },
      { title: "CONNECT", href: "/contact" },
    ],
  },
];

const NavItem = ({ item, setNavIsVisible }) => {
  const [dropdown, setDropdown] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === item.href;

  return (
    <li className="relative w-full lg:w-auto">
      {item.type === "link" ? (
        <Link
          to={item.href}
          onClick={() => setNavIsVisible(false)}
          className={`block lg:inline-block px-6 py-4 lg:py-2 font-bricolage text-sm lg:text-[11px] uppercase tracking-[0.3em] text-center lg:text-left transition-all duration-300 ${
            isActive ? "opacity-100" : "opacity-40 hover:opacity-100"
          }`}
        >
          {item.name}
        </Link>
      ) : (
        <div className="flex flex-col items-center">
          <button
            className="w-full lg:w-auto px-6 py-4 lg:py-2 flex justify-center lg:justify-start gap-2 items-center font-bricolage text-sm lg:text-[11px] uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all duration-300"
            onClick={() => setDropdown(!dropdown)}
          >
            <span>{item.name}</span>
            <RiArrowDownSLine className={`transition-transform duration-300 ${dropdown ? 'rotate-180' : ''}`} />
          </button>
          <div
            className={`${
              dropdown ? "block" : "hidden"
            } lg:absolute lg:top-full lg:left-0 lg:mt-4 bg-bone dark:bg-matte-black border-thin p-4 min-w-[220px] z-[60] animate-in fade-in slide-in-from-top-2 duration-300 w-full lg:w-auto`}
          >
            <ul className="flex flex-col gap-1">
              {item.items.map((page, index) => (
                <Link
                  key={index}
                  to={page.href}
                  onClick={() => {
                    setNavIsVisible(false);
                    setDropdown(false);
                  }}
                  className="block px-4 py-4 lg:py-3 text-[10px] font-ibm uppercase tracking-widest text-center lg:text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b-thin border-black/5 dark:border-white/5 last:border-0"
                >
                  {page.title}
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [navIsVisible, setNavIsVisible] = useState(false);
  const userState = useSelector((state) => state.user);
  const [profileDropdown, setprofileDropdown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  return (
    <section className="sticky top-0 left-0 right-0 z-50 bg-bone/80 dark:bg-matte-black/80 backdrop-blur-xl border-b-thin border-black/10 dark:border-white/10 transition-all duration-500">
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        {/* Architectural Logo */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative w-10 h-10 border-[1.5px] border-black dark:border-white flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-black/10 dark:bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="relative z-10">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
             </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-syne font-extrabold text-xl leading-none tracking-tighter uppercase">
              Think<span className="italic-accent font-normal lowercase tracking-normal">Tank</span>
            </span>
            <span className="font-geist text-[8px] tracking-[0.4em] uppercase opacity-40">Intelligence Hub</span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-6 relative z-[100]">
          <button onClick={toggleTheme} className="opacity-40 hover:opacity-100 transition-opacity p-2">
            {isDarkMode ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
          </button>
          <button onClick={() => setNavIsVisible(!navIsVisible)} className="opacity-40 hover:opacity-100 p-2">
            {navIsVisible ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
          </button>
        </div>

        {/* Navigation Layer */}
        <div
          className={`${
            navIsVisible ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          } fixed inset-0 lg:static bg-bone dark:bg-matte-black lg:bg-transparent transition-transform duration-500 ease-in-out flex flex-col lg:flex-row items-center justify-center lg:justify-end gap-12 lg:gap-16 z-[90]`}
        >
          <ul className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4 w-full lg:w-auto px-12 lg:px-0">
            {navItemsInfo.map((item) => (
              <NavItem key={item.name} item={item} setNavIsVisible={setNavIsVisible} />
            ))}
          </ul>

          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-8 mt-4 lg:mt-0">
            <button
              onClick={toggleTheme}
              className="hidden lg:block opacity-30 hover:opacity-100 transition-opacity"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <RiSunLine size={16} /> : <RiMoonLine size={16} />}
            </button>

            {userState.userInfo ? (
              <div className="relative group/profile">
                <button
                  className="flex items-center gap-4 group"
                  onClick={() => setprofileDropdown(!profileDropdown)}
                >
                  <div className="flex flex-col items-center lg:items-end order-2 lg:order-1">
                    <span className="font-ibm text-[9px] tracking-widest uppercase opacity-30">Status: Online</span>
                    <span className="font-syne font-bold text-xs uppercase tracking-tight">{userState.userInfo.name}</span>
                  </div>
                  <div className="w-10 h-10 lg:w-8 lg:h-8 border-thin border-black/10 dark:border-white/10 overflow-hidden order-1 lg:order-2">
                     <img 
                      src={userState.userInfo.avatar ? (userState.userInfo.avatar.startsWith("http") ? userState.userInfo.avatar : stables.UPLOAD_FOLDER_BASE_URL + userState.userInfo.avatar) : images.userImage}
                      alt="Profile"
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                </button>
                <div className={`${profileDropdown ? 'block' : 'hidden'} absolute bottom-full lg:top-full left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0 mb-6 lg:mt-6 bg-bone dark:bg-matte-black border-thin min-w-[240px] z-[100] animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-top-4 duration-500`}>
                  <div className="flex flex-col p-4">
                    <span className="font-geist text-[8px] tracking-[0.4em] uppercase opacity-20 mb-4 px-4 block">Security Console</span>
                    {userState?.userInfo?.admin && (
                      <button onClick={() => {navigate("/admin"); setNavIsVisible(false); setprofileDropdown(false)}} className="px-4 py-4 text-[10px] font-ibm uppercase text-left hover:bg-black/5 dark:hover:bg-white/5 border-b-thin border-black/5 dark:border-white/5 transition-colors">Access Dashboard</button>
                    )}
                    <button onClick={() => {navigate("/profile"); setNavIsVisible(false); setprofileDropdown(false)}} className="px-4 py-4 text-[10px] font-ibm uppercase text-left hover:bg-black/5 dark:hover:bg-white/5 border-b-thin border-black/5 dark:border-white/5 transition-colors">User Settings</button>
                    <button onClick={() => {dispatch(logout()); setNavIsVisible(false)}} className="px-4 py-4 text-[10px] font-ibm uppercase text-left text-red-500 hover:bg-red-500/10 transition-colors mt-2">Expunge Session</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setNavIsVisible(false)}
                className="px-12 py-4 lg:px-10 lg:py-3 bg-matte-black dark:bg-bone text-bone dark:text-matte-black font-bricolage text-xs lg:text-[11px] uppercase tracking-[0.4em] hover:opacity-80 transition-all border-thin border-transparent text-center min-w-[200px] lg:min-w-0"
              >
                Enter
              </Link>
            )}
          </div>
        </div>
      </header>
    </section>
  );
};

export default Header;


