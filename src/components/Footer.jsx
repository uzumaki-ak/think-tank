import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <section className="bg-bone dark:bg-matte-black pt-24 transition-colors duration-500 border-t-thin border-black/10 dark:border-white/10">
      <footer className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 pb-20">
          
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="font-syne font-extrabold text-xl tracking-tighter mb-6 block">
              THINK<span className="italic-accent font-normal lowercase tracking-normal">Tank</span>
            </Link>
            <p className="font-inter text-xs opacity-40 leading-relaxed max-w-[200px]">
              Precision-built archival intelligence for the inquisitive mind. Operating at the intersection of design and logic.
            </p>
          </div>

          <div>
            <h3 className="font-geist text-[10px] tracking-[0.3em] uppercase opacity-40 mb-8">Navigation</h3>
            <ul className="flex flex-col gap-4">
              {["Archive", "Edition", "Access", "Connect"].map((item) => (
                <li key={item}>
                  <a href="/" className="font-bricolage text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-geist text-[10px] tracking-[0.3em] uppercase opacity-40 mb-8">Resources</h3>
            <ul className="flex flex-col gap-4">
              {["Documentation", "Manifesto", "Protocols", "Intelligence"].map((item) => (
                <li key={item}>
                  <a href="/" className="font-bricolage text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-geist text-[10px] tracking-[0.3em] uppercase opacity-40 mb-8">System</h3>
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-ibm text-[10px] tracking-tight opacity-60 uppercase">Status: Optimized</span>
            </div>
          </div>

        </div>

        {/* Marquee Strip */}
        <div className="border-t-thin border-black/10 dark:border-white/10 py-6 overflow-hidden relative">
          <div className="flex whitespace-nowrap animate-marquee">
            <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 px-4">
              BUILT FOR THE FUTURE OF EDUCATION • OPERATING ON GROQ L3 • DESIGNED FOR EMPATHY • ARCHIVAL INTELLIGENCE • 
            </span>
            <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 px-4">
              BUILT FOR THE FUTURE OF EDUCATION • OPERATING ON GROQ L3 • DESIGNED FOR EMPATHY • ARCHIVAL INTELLIGENCE • 
            </span>
          </div>
        </div>

        <div className="py-8 flex justify-between items-center opacity-20">
          <span className="font-ibm text-[8px] tracking-widest uppercase">© 2026 THINK TANK EDITORIAL</span>
          <span className="font-ibm text-[8px] tracking-widest uppercase">DESIGNED FOR DISCIPLINE</span>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />
    </section>
  );
};

export default Footer;

