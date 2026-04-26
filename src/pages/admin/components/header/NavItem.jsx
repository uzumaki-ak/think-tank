import React from "react";
import { NavLink } from "react-router-dom";

const NavItem = ({
  link,
  title,
  name,
  activeNavName,
  setActiveNavName,
}) => {
  return (
    <NavLink
      to={link}
      className={`${
        name === activeNavName
          ? "opacity-100"
          : "opacity-40 hover:opacity-60"
      } flex items-center py-2 font-bricolage text-sm uppercase tracking-[0.2em] transition-all whitespace-nowrap`} 
      onClick={() => setActiveNavName(name)}
    >
      {title}
    </NavLink>
  );
};

export default NavItem;

