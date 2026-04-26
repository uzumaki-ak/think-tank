import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import { images, stables } from "../../constants";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SuggestedPosts from "./container/SuggestedPosts";
import CommentsContainer from "../../components/comments/CommentsContainer";
import SocialShareButtons from "../../components/SocialShareButtons";
import { getAllPosts, getSinglePost } from "../../services/index/posts";
import ArticleDetailSkeleton from "./components/ArticleDetailSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import { useSelector } from "react-redux";
import Editor from "../../components/editor/Editor";

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const userState = useSelector((state) => state.user);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost({ slug }),
    queryKey: ["blog", slug],
  });

  const { data: postsData } = useQuery({
    queryFn: () => getAllPosts(),
    queryKey: ["posts"],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="SORRY / SYNCHRONIZATION ERROR" />
      ) : (
        <section className="container mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <article className="flex-1 max-w-4xl">
              {/* Technical Breadcrumb */}
              <div className="flex items-center gap-4 mb-8 font-ibm text-[10px] tracking-[0.4em] uppercase opacity-40">
                <Link to="/">Root</Link>
                <span>/</span>
                <Link to="/blog">Archive</Link>
                <span>/</span>
                <span className="opacity-20">Current Node</span>
              </div>

              {/* Monolith Headline */}
              <h1 className="font-syne font-extrabold text-5xl md:text-7xl uppercase tracking-tighter leading-[0.85] mb-12">
                {data?.title}
              </h1>

              {/* Featured Media */}
              <div className="relative group overflow-hidden border-thin border-black/10 dark:border-white/10 mb-12">
                <img
                  className="w-full h-[600px] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  src={data?.photo ? (data.photo.startsWith("http") ? data.photo : stables.UPLOAD_FOLDER_BASE_URL + data.photo) : images.samplePostImage}
                  alt={data?.title}
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-matte-black/60 to-transparent">
                  <div className="flex gap-4">
                    {data?.categories?.map((category) => (
                      <Link
                        key={category._id}
                        to={`/blog?category=${category.name}`}
                        className="font-ibm text-[10px] tracking-widest uppercase bg-bone/10 backdrop-blur-sm border-thin border-white/20 px-4 py-2 hover:bg-bone hover:text-matte-black transition-all"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technical Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between border-y-thin border-black/10 dark:border-white/10 py-6 mb-16">
                <div className="flex items-center gap-8">
                  <div>
                    <span className="font-geist text-[9px] tracking-widest uppercase opacity-30 block mb-1">Release Date</span>
                    <span className="font-ibm text-xs opacity-60">
                      {new Date(data?.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="w-[1px] h-8 bg-black/10 dark:bg-white/10" />
                  <div>
                    <span className="font-geist text-[9px] tracking-widest uppercase opacity-30 block mb-1">Impact / Views</span>
                    <span className="font-ibm text-xs opacity-60">{data?.views || 0} UNITS</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                   <SocialShareButtons
                    url={encodeURI(window.location.href)}
                    title={encodeURIComponent(data?.title)}
                  />
                </div>
              </div>

              {/* Main Content */}
              <div className="prose-brutalist mb-24">
                {!isLoading && !isError && (
                  <Editor content={data?.body} editable={false} />
                )}
              </div>

              {/* Comments Section */}
              <div className="border-t-thin border-black/10 dark:border-white/10 pt-20">
                <div className="mb-12">
                  <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 mb-2 block">System Intelligence</span>
                  <h2 className="font-syne font-bold text-3xl uppercase tracking-tighter">Communications</h2>
                </div>
                <CommentsContainer
                  comments={data?.comments}
                  className="mt-10"
                  logginedUserId={userState?.userInfo?._id || ""}
                  postSlug={slug}
                />
              </div>
            </article>

            {/* Sidebar Archive */}
            <aside className="w-full lg:w-96 lg:sticky lg:top-32">
              <div className="border-thin border-black/10 dark:border-white/10 p-8">
                <SuggestedPosts
                  header="LATEST ARCHIVES"
                  posts={postsData?.data}
                  tags={data?.tags}
                />
                
                <div className="mt-12 pt-12 border-t-thin border-black/10 dark:border-white/10">
                  <span className="font-geist text-[9px] tracking-[0.4em] uppercase opacity-30 block mb-6">Distribution Nodes</span>
                  <SocialShareButtons
                    url={encodeURI(window.location.href)}
                    title={encodeURIComponent(data?.title)}
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default ArticleDetailPage;

