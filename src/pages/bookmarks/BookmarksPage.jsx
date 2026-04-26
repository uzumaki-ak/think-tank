import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getBookmarkedPosts } from "../../services/index/users";
import { useSelector } from "react-redux";
import MainLayout from "../../components/MainLayout";
import ArticleCard from "../../components/ArticleCard";
import ArticleCardSkeleton from "../../components/ArticleCardSkeleton";
import ErrorMessage from "../../components/ErrorMessage";

const BookmarksPage = () => {
  const userState = useSelector((state) => state.user);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getBookmarkedPosts({ token: userState.userInfo.token }),
    queryKey: ["bookmarked-posts"],
    enabled: !!userState.userInfo,
  });

  return (
    <MainLayout>
      <section className="container mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="mb-20 border-b-thin border-black/10 dark:border-white/10 pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 mb-4 block">Archive / Bookmarks</span>
            <h1 className="font-syne font-extrabold text-5xl md:text-7xl uppercase tracking-tighter leading-[0.8]">
              Your<br />
              <span className="italic-accent font-normal lowercase tracking-normal">library</span>
            </h1>
          </div>
          <div className="text-right">
            <span className="font-ibm text-[10px] tracking-widest uppercase opacity-40 block mb-2">Total Nodes Saved</span>
            <span className="font-ibm font-bold text-2xl">
              {data?.length || 0}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-20">
          {isLoading ? (
            [...Array(3)].map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))
          ) : isError ? (
            <ErrorMessage message="SYNCHRONIZATION ERROR / DATA UNREACHABLE" />
          ) : data?.length === 0 ? (
            <div className="col-span-full py-40 text-center border-thin border-dashed border-black/10 dark:border-white/10">
              <span className="font-ibm text-xs uppercase tracking-[0.3em] opacity-40">Your library is empty. Archive some nodes to populate this sector.</span>
            </div>
          ) : (
            data?.map((post) => (
              <ArticleCard
                key={post._id}
                post={post}
              />
            ))
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default BookmarksPage;
