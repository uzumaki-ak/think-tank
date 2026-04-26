import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    
    try {
      const { data } = await axios.post("/api/newsletter/subscribe", { email });
      toast.success(data.message || "PROTOCOL INITIATED / SUBSCRIPTION ACTIVE");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "SYNC_FAILURE: Archive inaccessible.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 border-t-thin border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start lg:items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 mb-4 block">Communication / Broadcast</span>
            <h2 className="font-syne font-extrabold text-4xl lg:text-5xl uppercase tracking-tighter leading-none mb-4">
              Intelligence<br className="hidden md:block" />
              <span className="italic-accent font-normal lowercase tracking-normal">Protocol</span>
            </h2>
            <p className="font-ibm text-xs opacity-40 uppercase tracking-widest max-w-sm mx-auto md:mx-0">
              Receive weekly analytical readouts and system updates directly to your terminal.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-0 border-thin border-black/10 dark:border-white/10 group focus-within:border-black dark:focus-within:border-white transition-all overflow-hidden">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="IDENTIFIER@EMAIL.COM"
              className="bg-transparent px-8 py-5 font-ibm text-[10px] tracking-widest uppercase outline-none flex-1 md:min-w-[300px] border-b-thin sm:border-b-0 sm:border-r-thin border-black/10 dark:border-white/10 sm:border-transparent"
            />
            <button 
              disabled={isLoading}
              className="bg-matte-black text-bone dark:bg-bone dark:text-matte-black px-10 py-5 font-bricolage text-[11px] tracking-[0.3em] uppercase hover:opacity-80 transition-opacity disabled:opacity-30 whitespace-nowrap"
            >
              {isLoading ? "SYNCING..." : "SUBSCRIBE"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
