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
              to={`/blog?search=${item}`}
              className="font-geist text-[9px] tracking-widest uppercase border-thin border-black/10 dark:border-white/10 px-4 py-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
            >
              {item}
            </Link>
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <div className="mt-16 p-6 border-thin border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 font-ibm text-[8px] text-green-500 opacity-20 tracking-tighter">[PEAK_NODE]</div>
          <span className="font-geist text-[8px] tracking-[0.4em] uppercase opacity-40 block mb-6">High Impact Card</span>
          {posts.sort((a,b) => (b.views || 0) - (a.views || 0))[0] && (
            <Link to={`/blog/${posts[0].slug}`} className="block">
              <h4 className="font-syne font-bold text-md uppercase tracking-tight leading-tight mb-4 group-hover:opacity-60 transition-opacity">
                {posts[0].title}
              </h4>
              <div className="flex justify-between items-center">
                <span className="font-ibm text-[10px] text-green-500 uppercase font-bold tracking-widest">{posts[0].views || 0} READS</span>
                <span className="font-geist text-[8px] tracking-[0.2em] uppercase opacity-20 underline underline-offset-4 decoration-dotted">Access Node</span>
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestedPosts;

