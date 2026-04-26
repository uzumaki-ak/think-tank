import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NavItemCollapse = ({
  title,
  children,
  name,
  activeNavName,
  setActiveNavName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (activeNavName !== name) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [activeNavName, name]);

  return (
    <div className="py-2">
      <button
        className={`${
          name === activeNavName ? "opacity-100" : "opacity-40 hover:opacity-60"
        } flex w-full items-center justify-between font-bricolage text-sm uppercase tracking-[0.2em] transition-all py-2`}
        onClick={() => {
          setActiveNavName(name);
          setIsOpen(!isOpen);
        }}
      >
        <span>{title}</span>
        <span className={`text-[8px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-y-4 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavItemCollapse;

