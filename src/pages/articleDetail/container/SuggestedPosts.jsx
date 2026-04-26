import React from "react";
import { images, stables } from "../../../constants";
import { Link } from "react-router-dom";

const SuggestedPosts = ({ className, header, posts = [], tags = [] }) => {
  return (
    <div className={`${className} bg-transparent`}>
      <h2 className="font-syne font-bold text-lg uppercase tracking-tighter mb-8 pb-4 border-b-thin border-black/10 dark:border-white/10">
        {header}
      </h2>
      <div className="grid gap-y-8 mt-5">
        {posts.slice(0, 4).map((item) => (
          <div
            key={item._id}
            className="flex gap-4 items-center group transition-all"
          >
            <img
              className="w-16 h-16 object-cover border-thin grayscale group-hover:grayscale-0 transition-all duration-500"
              src={
                item?.photo
                  ? item.photo.startsWith("http")
                    ? item.photo
                    : stables.UPLOAD_FOLDER_BASE_URL + item.photo
                  : images.samplePostImage
              }
              alt={item.title}
            />
            <div className="flex-1">
              <h3 className="font-syne font-bold text-sm uppercase tracking-tight leading-tight mb-1">
                <Link to={`/blog/${item.slug}`} className="hover:opacity-60 transition-opacity">
                  {item.title}
                </Link>
              </h3>
              <span className="font-ibm text-[9px] tracking-widest uppercase opacity-40">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-syne font-bold text-lg uppercase tracking-tighter mt-16 mb-8 pb-4 border-b-thin border-black/10 dark:border-white/10">
        Index / Tags
      </h2>
      {!tags || tags.length === 0 ? (
        <p className="font-ibm text-[10px] tracking-widest uppercase opacity-20">NO TAGS DETECTED</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((item, index) => (
            <Link
              key={index}
              to="/"
              className="font-geist text-[9px] tracking-widest uppercase border-thin border-black/10 dark:border-white/10 px-4 py-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestedPosts;

