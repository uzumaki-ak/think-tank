import React from "react";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { images, stables } from "../constants";
import { Link } from "react-router-dom";

const ArticleCard = ({ post, className }) => {
  return (
    <div className={`group bg-bone dark:bg-matte-black transition-all duration-500 hover:bg-black/5 dark:hover:bg-white/5 ${className}`}>
      <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden aspect-[4/3]">
        <img
          src={
            post.photo
              ? post.photo.startsWith("http")
                ? post.photo
                : stables.UPLOAD_FOLDER_BASE_URL + post.photo
              : images.samplePostImage
          }
          alt={post.title}
          className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Link
            to={`/blog?category=${post.categories?.[0]?.title || "Editorial"}`}
            className="font-geist text-[9px] tracking-[0.3em] uppercase bg-matte-black text-bone px-2 py-1 hover:bg-bone hover:text-matte-black transition-all"
          >
            {post.categories?.[0]?.title || "Editorial"}
          </Link>
        </div>
      </Link>
      
      <div className="p-8">
        <Link to={`/blog/${post.slug}`}>
          <h2 className="font-syne font-bold text-2xl uppercase leading-tight tracking-tighter mb-4 group-hover:text-matte-black/60 dark:group-hover:text-bone/60 transition-colors">
            {post.title}
          </h2>
          <p className="font-inter text-sm opacity-60 line-clamp-2 mb-8 leading-relaxed">
            {post.caption}
          </p>
        </Link>

        <div className="flex justify-between items-end pt-6 border-t-[0.5px] border-black/10 dark:border-white/10">
          <div className="flex items-center gap-x-4">
            <img
              src={
                post.user?.avatar
                  ? post.user.avatar.startsWith("http")
                    ? post.user.avatar
                    : stables.UPLOAD_FOLDER_BASE_URL + post.user.avatar
                  : images.userImage
              }
              alt="author"
              className="w-8 h-8 rounded-none border-[0.5px] border-black/20 dark:border-white/20 object-cover"
            />
            <div className="flex flex-col">
              <span className="font-geist text-[9px] tracking-widest uppercase opacity-40">Contributor</span>
              <h4 className="font-bricolage text-xs font-semibold uppercase">
                {post.user?.name || "Anonymous"}
              </h4>
            </div>
          </div>

          <div className="text-right">
            <span className="font-ibm text-[10px] tracking-tight opacity-40">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "ND"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;

