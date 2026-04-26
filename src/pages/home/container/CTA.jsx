import React from "react";

const CTA = () => {
  return (
    <section className="relative bg-matte-black py-24 lg:py-40 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div>
            <span className="font-ibm text-[10px] tracking-[0.4em] uppercase text-bone/40 mb-6 block">Communication / Newsletter</span>
            <h2 className="text-bone font-syne font-extrabold text-4xl md:text-6xl uppercase leading-[0.95] tracking-tighter mb-10">
              Intelligence <br />
              <span className="italic-accent lowercase tracking-normal text-bone/30">Delivered</span> <br />
              Weekly.
            </h2>
            <p className="text-bone/60 font-inter text-lg max-w-md leading-relaxed mb-12">
              Join 50,000+ inquisitive minds. No spam, no fluff. Just pure, architectural insights delivered to your terminal.
            </p>
          </div>

          <div className="border-thin border-white/10 p-8 md:p-12 bg-white/5 backdrop-blur-sm relative">
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-bone flex items-center justify-center">
              <span className="text-matte-black font-ibm text-[10px] font-bold">+</span>
            </div>
            
            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-geist text-[9px] tracking-widest uppercase text-bone/40">Input / Identification</label>
                <input
                  type="email"
                  placeholder="USER@NETWORK.COM"
                  className="bg-transparent border-b-thin border-white/20 py-4 font-ibm text-bone placeholder:text-white/10 focus:border-white outline-none transition-all"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-6 bg-bone text-matte-black font-bricolage text-sm uppercase tracking-[0.2em] hover:bg-white/90 transition-all active:scale-[0.98]"
              >
                Establish Connection
              </button>
            </form>

            <div className="mt-10 flex justify-between items-center opacity-20 font-ibm text-[8px] tracking-widest uppercase">
              <span>Secure Protocol</span>
              <span>v.01.2026</span>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Architectural Line */}
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white/5 hidden lg:block"></div>
      <div className="absolute bottom-1/4 left-0 w-full h-[1px] bg-white/5 hidden lg:block"></div>
    </section>
  );
};

export default CTA;

