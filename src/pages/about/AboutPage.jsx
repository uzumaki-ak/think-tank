import React from "react";
import MainLayout from "../../components/MainLayout";

const AboutPage = () => {
  return (
    <MainLayout>
      <section className="container mx-auto px-6 py-24 animate-in fade-in duration-1000">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-20 border-b-thin border-black/10 dark:border-white/10 pb-12">
            <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 mb-4 block">System Manifest / 001</span>
            <h1 className="font-syne font-extrabold text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.8]">
              Think<br />
              <span className="italic-accent font-normal lowercase tracking-normal">Tank</span>
            </h1>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-syne font-bold text-xl uppercase tracking-tight mb-6">Our Protocol</h2>
              <p className="font-inter text-sm opacity-60 leading-relaxed mb-6">
                ThinkTank is a high-fidelity intelligence hub designed for the modern era of data consumption. We reject the generic, the cluttered, and the playful in favor of architectural precision and disciplined typography.
              </p>
              <p className="font-inter text-sm opacity-60 leading-relaxed">
                Our mission is to provide a curated archive of insights, processed through a lens of minimalist brutalism and technical excellence.
              </p>
            </div>
            
            <div className="space-y-12">
              <div>
                <span className="font-geist text-[9px] tracking-widest uppercase opacity-30 block mb-4">Core Values</span>
                <ul className="space-y-4 font-ibm text-[10px] uppercase tracking-widest opacity-60">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-black dark:bg-white" /> Architectural Rigor</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-black dark:bg-white" /> Typographic Discipline</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-black dark:bg-white" /> Visual Silence</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-black dark:bg-white" /> Technical Honesty</li>
                </ul>
              </div>

              <div>
                <span className="font-geist text-[9px] tracking-widest uppercase opacity-30 block mb-4">Technical Stack</span>
                <p className="font-ibm text-[10px] opacity-40 leading-loose uppercase tracking-tighter">
                  MERN STACK / TANSTACK QUERY / REDUX TOOLKIT / TAILWIND CSS / SYNE & GEIST TYPEFACES
                </p>
              </div>
            </div>
          </div>

          {/* Full Width Quote */}
          <div className="mt-32 py-20 border-y-thin border-black/10 dark:border-white/10 text-center">
            <p className="font-syne font-bold text-2xl md:text-4xl uppercase tracking-tight leading-tight max-w-2xl mx-auto">
              "PRECISION IS THE ONLY <span className="italic-accent lowercase">Defense</span> AGAINST CLUTTER."
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
