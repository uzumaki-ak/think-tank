import React from "react";
import { FiArrowRight } from "react-icons/fi";
import ArticleCard from "../../../components/ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../../services/index/posts";
import { toast } from "react-hot-toast";
import ArticleCardSkeleton from "../../../components/ArticleCardSkeleton";
import ErrorMessage from "../../../components/ErrorMessage";
import { Link } from "react-router-dom";

const Articles = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getAllPosts("", 1, 6),
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  return (
    <section className="bg-bone dark:bg-matte-black py-24 transition-colors duration-500">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="font-ibm text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4 block">Archive Selection</span>
            <h2 className="font-syne font-bold text-4xl lg:text-6xl uppercase tracking-tighter">
              Curated <span className="italic-accent lowercase">Insights</span>
            </h2>
          </div>
          <Link to="/blog" className="group flex items-center gap-4 font-bricolage text-sm uppercase tracking-widest pb-2 border-b-thin border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white transition-all">
            <span>View All Releases</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-thin border-black/10 dark:border-white/10">
          {isLoading ? (
            [...Array(6)].map((_, index) => (
              <ArticleCardSkeleton key={index} className="border-thin border-black/10 dark:border-white/10" />
            ))
          ) : isError ? (
            <div className="col-span-full p-20 text-center border-thin">
              <ErrorMessage message="Connection lost. Archive inaccessible." />
            </div>
          ) : (
            data?.data.map((post, index) => (
              <ArticleCard
                key={post._id}
                post={post}
                className={`border-thin border-black/10 dark:border-white/10 ${
                  index === 0 ? "lg:col-span-2 lg:row-span-1" : ""
                }`}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Articles;

