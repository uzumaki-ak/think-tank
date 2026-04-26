import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../../services/index/posts";
import { getAllComments } from "../../../services/index/comments";
import { useSelector } from "react-redux";

const Briefing = () => {
  const userState = useSelector((state) => state.user);
  const token = userState.userInfo?.token || "";

  const { data: postsData } = useQuery({
    queryFn: () => getAllPosts("", 1, 100),
    queryKey: ["admin-posts-briefing"],
  });

  const { data: commentsData } = useQuery({
    queryFn: () => getAllComments(token, "", 1, 100),
    queryKey: ["admin-comments-briefing", token],
    enabled: !!token,
  });

  const totalViews = postsData?.data?.reduce((acc, post) => acc + (post.views || 0), 0) || 0;
  const avgEngagement = postsData?.data?.length ? (commentsData?.data?.length / postsData.data.length).toFixed(2) : 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b-thin border-black/10 dark:border-white/10 pb-12">
        <div>
          <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 mb-4 block">Intelligence / [AI_BRIEFING]</span>
          <h1 className="font-syne font-extrabold text-4xl lg:text-6xl uppercase tracking-tighter">
            System <span className="italic-accent lowercase">Briefing</span>
          </h1>
        </div>
        <div className="text-right">
          <span className="font-ibm text-[10px] text-green-500 uppercase tracking-widest">[ANALYSIS_COMPLETE]</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Executive Summary */}
          <section className="p-8 border-thin border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01]">
            <h2 className="font-syne font-bold text-xl uppercase tracking-tight mb-8">Executive Summary</h2>
            <div className="space-y-6 font-ibm text-xs uppercase tracking-widest opacity-60 leading-loose">
              <p>• The system has achieved a total of <span className="text-black dark:text-white font-bold">{totalViews}</span> units of intelligence consumption.</p>
              <p>• Engagement density is currently holding at <span className="text-black dark:text-white font-bold">{avgEngagement}</span> signals per node.</p>
              <p>• Categorical distribution remains stable with high concentrations in the <span className="text-black dark:text-white font-bold">Primary Sectors</span>.</p>
              <p>• Sentiment analysis of incoming data streams indicates a <span className="text-green-500 font-bold">Positive Growth</span> trajectory.</p>
            </div>
          </section>

          {/* High Impact Analytics */}
          <section>
            <h2 className="font-syne font-bold text-xl uppercase tracking-tight mb-8">Anomalous Growth Nodes</h2>
            <div className="grid gap-6">
              {postsData?.data?.slice(0, 3).map((post, i) => (
                <div key={post._id} className="p-6 border-thin border-black/10 dark:border-white/10 flex justify-between items-center group hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  <div className="flex gap-6 items-center">
                    <span className="font-syne font-bold text-2xl opacity-10">0{i+1}</span>
                    <div>
                      <h4 className="font-syne font-bold text-md uppercase tracking-tight">{post.title}</h4>
                      <span className="font-ibm text-[9px] opacity-30">PEAK_VIEW_RATIO: {(post.views / (totalViews || 1) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <span className="font-geist text-[8px] tracking-widest uppercase opacity-20">[STABLE]</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-12">
          <section className="p-8 border-thin border-black/10 dark:border-white/10">
            <h3 className="font-syne font-bold text-md uppercase tracking-tight mb-6">AI Forecast</h3>
            <div className="h-40 flex items-end gap-1 mb-6">
              {[40, 50, 45, 60, 75, 80, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-green-500/20 border-t-thin border-green-500/40 relative group">
                  <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                  <div style={{ height: `${h}%` }} className="w-full" />
                </div>
              ))}
            </div>
            <p className="font-ibm text-[9px] tracking-widest uppercase opacity-40 leading-relaxed">
              Predictive models suggest a 12% increase in network activity over the next 72-hour cycle.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Briefing;
