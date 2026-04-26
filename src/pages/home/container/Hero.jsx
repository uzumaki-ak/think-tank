import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-bone dark:bg-matte-black pt-12 pb-24 lg:pt-32 lg:pb-48 transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          
          <div className="mb-6 lg:mb-8 flex items-center gap-4">
            <span className="w-8 lg:w-12 h-[1px] bg-black/20 dark:bg-white/20"></span>
            <span className="font-geist text-[9px] lg:text-[10px] tracking-[0.4em] uppercase opacity-60">Volume 01 / Issue 04</span>
          </div>

          <h1 className="font-syne font-extrabold text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-[1] md:leading-[0.9] tracking-tighter uppercase mb-10 lg:mb-12 max-w-full lg:max-w-5xl overflow-visible">
            Think <br className="hidden sm:block" />
            <span className="italic-accent lowercase tracking-normal text-matte-black/40 dark:text-bone/30 block sm:inline sm:ml-20">Tank</span> <br className="hidden sm:block" />
            Intelligence.
          </h1>

          <div className="max-w-xl mb-12 lg:mb-16 px-2 sm:px-0">
            <p className="font-inter text-base sm:text-lg md:text-xl opacity-70 leading-relaxed tracking-tight">
              A premium archive of curated thoughts on design, engineering, and the human condition. Precision-built for the inquisitive mind.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center lg:items-start">
            <button 
              onClick={() => navigate("/blog")}
              className="w-full sm:w-auto px-12 py-5 bg-matte-black dark:bg-bone text-bone dark:text-matte-black font-bricolage text-sm uppercase tracking-[0.2em] cta-invert border-thin whitespace-nowrap"
            >
              Explore Archive
            </button>
            <button 
              onClick={() => navigate("/about")}
              className="w-full sm:w-auto px-12 py-5 border-thin font-bricolage text-sm uppercase tracking-[0.2em] hover:bg-black/5 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              The Vision
            </button>
          </div>
        </div>
      </div>

      {/* Monochromatic Pulse Visualizer */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] pointer-events-none opacity-20 dark:opacity-30 hidden lg:block">
        <div className="w-full h-full rounded-full bg-black dark:bg-white blur-[120px] animate-pulse scale-90 mix-blend-difference"></div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[0.5px] bg-black/10 dark:border-white/10"></div>
    </section>
  );
};

export default Hero;

