import React, { useEffect, useState } from "react";
import { getAllPosts } from "../../services/index/posts";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ArticleCardSkeleton from "../../components/ArticleCardSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import ArticleCard from "../../components/ArticleCard";
import MainLayout from "../../components/MainLayout";
import Pagination from "../../components/Pagination";
import { useSearchParams, Link } from "react-router-dom";
import AsyncMultiSelectTagDropdown from "../../components/SelectAsyncPaginate";
import { getAllCategories } from "../../services/index/postCategories";
import { filterCategories } from "../../utils/multiSelectTagUtils";
import Newsletter from "../../components/Newsletter";

let isFirstRun = true;

const promiseOptions = async (search, loadedOptions, { page }) => {
  const { data: categoriesData, headers } = await getAllCategories(search, page);
  return {
    options: filterCategories(search, categoriesData),
    hasMore: parseInt(headers["x-totalpagecount"]) !== parseInt(headers["x-currentPage"]),
    additional: { page: page + 1 },
  };
};

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsValue = Object.fromEntries(searchParams.entries());
  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const SearchKeyboard = searchParamsValue?.search || "";
  const categoryFromUrl = searchParamsValue?.category || "";
  
  const [categories, setCategories] = useState(
    categoryFromUrl ? [categoryFromUrl] : []
  );

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () => getAllPosts(SearchKeyboard, currentPage, 12, categories),
    queryKey: ["posts", SearchKeyboard, currentPage, categories],
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const urlCategory = searchParams.get("category");
    if (urlCategory && !categories.includes(urlCategory)) {
      setCategories([urlCategory]);
    }
  }, [searchParams, categories]);

  useEffect(() => {
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    refetch();
  }, [currentPage, SearchKeyboard, categories, refetch]);

  const handlePageChange = (page) => {
    setSearchParams({ page, search: SearchKeyboard });
  };

  const handleSearchChange = (e) => {
    setSearchParams({ page: 1, search: e.target.value });
  };

  return (
    <MainLayout>
      <section className="container mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Header Section */}
        <div className="mb-20 border-b-thin border-black/10 dark:border-white/10 pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 mb-4 block">Archive / Intelligence</span>
            <h1 className="font-syne font-extrabold text-5xl md:text-7xl uppercase tracking-tighter leading-[0.8]">
              THE<br />
              <span className="italic-accent font-normal lowercase tracking-normal">Inventory</span>
            </h1>
          </div>
          <div className="text-right">
            <span className="font-ibm text-[10px] tracking-widest uppercase opacity-40 block mb-2">Total Archives Released</span>
            <span className="font-ibm font-bold text-2xl">
              {data?.headers?.["x-totalcount"] || 0}
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-0 mb-20 border-thin border-black/10 dark:border-white/10">
          <div className="flex-1 flex items-center border-b-thin md:border-b-0 md:border-r-thin border-black/10 dark:border-white/10">
            <input
              type="text"
              placeholder="SEARCH BY KEYWORD..."
              className="w-full bg-transparent font-ibm text-xs uppercase tracking-widest px-8 py-6 outline-none placeholder:opacity-20"
              value={SearchKeyboard}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-full md:w-96 p-2 bg-black/5 dark:bg-white/5">
            <AsyncMultiSelectTagDropdown
              placeholder={"FILTER BY CATEGORY"}
              loadOptions={promiseOptions}
              onChange={(selectedValues) => {
                setCategories(selectedValues.map((item) => item.value));
              }}
            />
          </div>
        </div>

        {/* Top Intelligence Section */}
        {!isLoading && data?.data.length > 0 && (
          <div className="mb-32">
            <div className="flex justify-between items-end mb-12 border-b-thin border-black/10 dark:border-white/10 pb-6">
              <h2 className="font-syne font-bold text-3xl uppercase tracking-tight">Top Intelligence</h2>
              <span className="font-ibm text-[10px] tracking-widest uppercase opacity-40">[PEAK_TRAFFIC_NODES]</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-thin border-black/10 dark:border-white/10">
              {data.data.slice(0, 3).map((post, i) => (
                <Link 
                  key={post._id}
                  to={`/blog/${post.slug}`}
                  className="p-8 border-thin border-black/10 dark:border-white/10 group hover:bg-black/5 dark:hover:bg-white/5 transition-all flex flex-col justify-between h-64"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-syne font-bold text-4xl opacity-10 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                    <span className="font-ibm text-[9px] text-green-500 uppercase tracking-widest">{post.views || 0} READS</span>
                  </div>
                  <div>
                    <h4 className="font-syne font-bold text-xl uppercase tracking-tight mb-2 line-clamp-2">{post.title}</h4>
                    <span className="font-geist text-[8px] tracking-[0.4em] uppercase opacity-40">View Node [→]</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="mb-12 flex justify-between items-end border-b-thin border-black/10 dark:border-white/10 pb-6">
           <h2 className="font-syne font-bold text-3xl uppercase tracking-tight">Master Inventory</h2>
           <span className="font-ibm text-[10px] tracking-widest uppercase opacity-40">[FULL_DATA_SET]</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-20">
          {isLoading || isFetching ? (
            [...Array(6)].map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))
          ) : isError ? (
            <ErrorMessage message="SYNCHRONIZATION ERROR / DATA UNREACHABLE" />
          ) : data?.data.length === 0 ? (
            <div className="col-span-full py-40 text-center border-thin border-dashed border-black/10 dark:border-white/10">
              <span className="font-ibm text-xs uppercase tracking-[0.3em] opacity-40">No entries detected in selected sector.</span>
            </div>
          ) : (
            data?.data.map((post) => (
              <ArticleCard
                key={post._id}
                post={post}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && data?.headers?.["x-totalpagecount"] && (
          <div className="mt-12 border-t-thin border-black/10 dark:border-white/10 pt-12">
            <Pagination
              onPageChange={(page) => handlePageChange(page)}
              currentPage={currentPage}
              totalPageCount={JSON.parse(data.headers["x-totalpagecount"])}
            />
          </div>
        )}
      </section>
      <Newsletter />
    </MainLayout>
  );
};

export default BlogPage;

