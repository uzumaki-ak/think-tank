import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { getAllPosts } from "../../../services/index/posts";
import { getAllComments } from "../../../services/index/comments";
import { getAllUsers } from "../../../services/index/users";
import { getAllCategories } from "../../../services/index/postCategories";
import { stables, images } from "../../../constants";

const Admin = () => {
  const userState = useSelector((state) => state.user);
  const token = userState.userInfo?.token || "";

  const parseTotalCount = (headers) => {
    const raw = headers?.["x-totalcount"];
    if (raw === undefined || raw === null) return null;
    try {
      return Number(JSON.parse(raw));
    } catch (error) {
      return Number(raw);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const { data: postsData, isLoading: postsLoading, isError: postsError } = useQuery({
    queryFn: () => getAllPosts("", 1, 50),
    queryKey: ["admin-posts"],
    onError: (error) => toast.error(error.message),
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryFn: () => getAllComments(token, "", 1, 50),
    queryKey: ["admin-comments", token],
    enabled: Boolean(token),
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryFn: () => getAllUsers(token, "", 1, 50),
    queryKey: ["admin-users", token],
    enabled: Boolean(token),
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryFn: () => getAllCategories("", 1, 50),
    queryKey: ["admin-categories"],
  });

  const totalPosts = parseTotalCount(postsData?.headers);
  const totalComments = parseTotalCount(commentsData?.headers);
  const totalUsers = parseTotalCount(usersData?.headers);
  const totalCategories = parseTotalCount(categoriesData?.headers);

  const pendingComments = commentsData?.data?.filter((comment) => !comment.check).length || 0;
  const recentPosts = postsData?.data?.slice(0, 6) || [];
  const recentComments = commentsData?.data?.slice(0, 6) || [];
  const recentUsers = usersData?.data?.slice(0, 6) || [];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b-thin border-black/10 dark:border-white/10 pb-12">
        <div>
          <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 mb-4 block">System / Overview</span>
          <h1 className="font-syne font-extrabold text-4xl lg:text-6xl uppercase tracking-tighter">
            Archive <span className="italic-accent lowercase">Intelligence</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Posts", "Comments", "Users", "Categories"].map((link) => (
            <Link
              key={link}
              to={`/admin/${link === 'Posts' ? 'posts/manage' : link === 'Users' ? 'users/manage' : link.toLowerCase()}`}
              className="px-6 py-2 border-thin font-bricolage text-xs uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-0 border-thin border-black/10 dark:border-white/10">
        {[
          { label: "Total Posts", value: totalPosts, loading: postsLoading, sub: "Archive Volume" },
          { label: "Total Comments", value: totalComments, loading: commentsLoading, sub: "Community Data" },
          { label: "Pending Reviews", value: pendingComments, loading: commentsLoading, sub: "Active Moderation" },
          { label: "Total Users", value: totalUsers, loading: usersLoading, sub: "Network Size" }
        ].map((stat, i) => (
          <div key={i} className="p-8 border-thin border-black/10 dark:border-white/10 flex flex-col justify-between h-48">
            <span className="font-geist text-[9px] tracking-widest uppercase opacity-40">{stat.label}</span>
            <h3 className="font-ibm text-4xl font-light tracking-tighter">
              {stat.loading ? "---" : stat.value ?? "00"}
            </h3>
            <span className="font-ibm text-[8px] tracking-tight opacity-30 uppercase">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Industrial Visualization Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="p-8 border-thin border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="mb-8">
            <span className="font-geist text-[9px] tracking-widest uppercase opacity-30 block mb-2">Technical Readout / 01</span>
            <h3 className="font-syne font-bold text-xl uppercase tracking-tight">Category Distribution</h3>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="2" className="text-black/5 dark:text-white/5" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="30 70" className="text-black dark:text-white transition-all duration-1000" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="20 80" strokeDashoffset="-30" className="text-black/40 dark:text-white/40 transition-all duration-1000" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="50 50" strokeDashoffset="-50" className="text-black/10 dark:text-white/10 transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-ibm text-2xl font-light tracking-tighter">{totalCategories || 0}</span>
                <span className="font-geist text-[7px] tracking-widest uppercase opacity-30">Nodes</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {categoriesData?.data?.slice(0, 4).map((cat, i) => (
                <div key={cat._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 ${i === 0 ? 'bg-black dark:bg-white' : i === 1 ? 'bg-black/40 dark:bg-white/40' : 'bg-black/10 dark:bg-white/10'}`} />
                    <span className="font-ibm text-[10px] uppercase tracking-wider opacity-60">{cat.title}</span>
                  </div>
                  <span className="font-ibm text-[10px] opacity-20">{(100 / (i + 1)).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-thin border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="mb-8">
            <span className="font-geist text-[9px] tracking-widest uppercase opacity-30 block mb-2">Technical Readout / 02</span>
            <h3 className="font-syne font-bold text-xl uppercase tracking-tight">Engagement Flow</h3>
          </div>
          <div className="h-48 flex items-end gap-2">
            {[60, 40, 85, 50, 70, 90, 30].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-black/10 dark:bg-white/10 group-hover:bg-black dark:group-hover:bg-white transition-all duration-500 relative" 
                  style={{ height: `${val}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity font-ibm text-[8px] tracking-tighter">
                    {val}
                  </div>
                </div>
                <span className="font-ibm text-[7px] opacity-20 uppercase">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Recent Activity */}
          <section>
            <div className="flex justify-between items-end mb-8">
              <h2 className="font-syne font-bold text-2xl uppercase tracking-tight">Recent Releases</h2>
              <Link to="/admin/posts/manage" className="font-geist text-[10px] tracking-widest uppercase opacity-60 hover:opacity-100">View History</Link>
            </div>
            <div className="border-thin border-black/10 dark:border-white/10 divide-y-thin divide-black/10 dark:divide-white/10">
              {recentPosts.map((post) => (
                <div key={post._id} className="flex items-center gap-6 p-6 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <img
                    src={post?.photo ? (post.photo.startsWith("http") ? post.photo : stables.UPLOAD_FOLDER_BASE_URL + post.photo) : images.samplePostImage}
                    alt=""
                    className="h-16 w-16 grayscale hover:grayscale-0 transition-all border-thin"
                  />
                  <div className="flex-1">
                    <h4 className="font-syne font-bold text-lg uppercase tracking-tight leading-none mb-2">{post.title}</h4>
                    <div className="flex items-center gap-4 font-ibm text-[10px] opacity-40 uppercase">
                      <span>{formatDate(post.createdAt)}</span>
                      <span>•</span>
                      <span>{post.views || 0} Views</span>
                    </div>
                  </div>
                  <Link to={`/admin/posts/manage/edit/${post.slug}`} className="font-bricolage text-[10px] tracking-widest uppercase opacity-60 hover:opacity-100">Edit</Link>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Comments */}
          <section>
            <div className="flex justify-between items-end mb-8">
              <h2 className="font-syne font-bold text-2xl uppercase tracking-tight">Incoming Data</h2>
              <Link to="/admin/comments" className="font-geist text-[10px] tracking-widest uppercase opacity-60 hover:opacity-100">Moderation Hub</Link>
            </div>
            <div className="border-thin border-black/10 dark:border-white/10 divide-y-thin divide-black/10 dark:divide-white/10">
              {recentComments.map((comment) => (
                <div key={comment._id} className="flex items-start gap-6 p-6">
                  <img
                    src={comment?.user?.avatar ? (comment.user.avatar.startsWith("http") ? comment.user.avatar : stables.UPLOAD_FOLDER_BASE_URL + comment.user.avatar) : images.userImage}
                    alt=""
                    className="h-10 w-10 border-thin grayscale"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bricolage text-xs font-bold uppercase">{comment?.user?.name || "Anonymous"}</h4>
                      <span className="font-ibm text-[8px] opacity-30">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="font-inter text-sm opacity-60 line-clamp-2">{comment.desc}</p>
                  </div>
                  <span className={`font-geist text-[8px] tracking-widest uppercase ${comment.check ? 'text-green-500' : 'text-orange-500'}`}>
                    {comment.check ? "[A]" : "[P]"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-12">
          <section className="p-8 border-thin border-black/10 dark:border-white/10">
            <h2 className="font-syne font-bold text-xl uppercase tracking-tight mb-8">Network Nodes</h2>
            <div className="space-y-6">
              {recentUsers.map((user) => (
                <div key={user._id} className="flex items-center gap-4">
                  <img
                    src={user?.avatar ? (user.avatar.startsWith("http") ? user.avatar : stables.UPLOAD_FOLDER_BASE_URL + user.avatar) : images.userImage}
                    alt=""
                    className="h-8 w-8 border-thin grayscale"
                  />
                  <div>
                    <h4 className="font-bricolage text-xs font-bold uppercase">{user.name}</h4>
                    <p className="font-ibm text-[9px] opacity-40 lowercase">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="p-8 border-thin border-black/10 dark:border-white/10 bg-black text-white dark:bg-white dark:text-black transition-colors duration-500">
            <h2 className="font-syne font-bold text-xl uppercase tracking-tight mb-8">Archive Tags</h2>
            <div className="flex flex-wrap gap-2">
              {categoriesData?.data?.slice(0, 15).map((category) => (
                <span key={category._id} className="font-ibm text-[9px] tracking-widest uppercase border-[0.5px] border-white/20 dark:border-black/20 px-3 py-1.5">
                  {category.title}
                </span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Admin;

