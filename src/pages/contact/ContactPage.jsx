import React from "react";
import MainLayout from "../../components/MainLayout";

const ContactPage = () => {
  return (
    <MainLayout>
      <section className="container mx-auto px-6 py-24 animate-in fade-in duration-1000">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-20 border-b-thin border-black/10 dark:border-white/10 pb-12">
            <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 mb-4 block">Communication Protocol / 002</span>
            <h1 className="font-syne font-extrabold text-5xl md:text-7xl uppercase tracking-tighter leading-[0.8]">
              Connect<br />
              <span className="italic-accent font-normal lowercase tracking-normal">Gateway</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div className="md:col-span-1 space-y-12">
              <div>
                <span className="font-geist text-[9px] tracking-widest uppercase opacity-30 block mb-4">Inquiries</span>
                <p className="font-ibm text-xs tracking-wider opacity-60">protocol@thinktank.net</p>
              </div>
              <div>
                <span className="font-geist text-[9px] tracking-widest uppercase opacity-30 block mb-4">Location</span>
                <p className="font-ibm text-xs tracking-wider opacity-60 uppercase">Node 01 / Sector 7<br />Distributed Intelligence</p>
              </div>
              <div>
                <span className="font-geist text-[9px] tracking-widest uppercase opacity-30 block mb-4">Status</span>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 animate-pulse" />
                  <span className="font-ibm text-[10px] tracking-widest uppercase opacity-60">System Online</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-geist text-[9px] tracking-widest uppercase opacity-30">Identifier</label>
                    <input type="text" placeholder="ENTER NAME" className="w-full bg-transparent border-thin border-black/10 dark:border-white/10 p-4 font-ibm text-[10px] tracking-widest uppercase outline-none focus:border-black dark:focus:border-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-geist text-[9px] tracking-widest uppercase opacity-30">Protocol / Email</label>
                    <input type="email" placeholder="ENTER EMAIL" className="w-full bg-transparent border-thin border-black/10 dark:border-white/10 p-4 font-ibm text-[10px] tracking-widest uppercase outline-none focus:border-black dark:focus:border-white transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-geist text-[9px] tracking-widest uppercase opacity-30">Transmission Content</label>
                  <textarea rows="6" placeholder="ENTER MESSAGE" className="w-full bg-transparent border-thin border-black/10 dark:border-white/10 p-4 font-ibm text-[10px] tracking-widest uppercase outline-none focus:border-black dark:focus:border-white transition-all resize-none" />
                </div>
                <button type="submit" className="w-full bg-matte-black text-bone dark:bg-bone dark:text-matte-black py-5 font-bricolage text-[11px] tracking-[0.4em] uppercase hover:opacity-80 transition-opacity">
                  Initiate Transmission
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactPage;
