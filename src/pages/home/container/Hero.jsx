import React, { useMemo } from "react";
import { images } from "../../../constants";
import Search from "../../../components/Search";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../../services/index/posts";
import { toast } from "react-hot-toast";
const Hero = () => {
  const navigate = useNavigate();

  const { data: postsData, isError } = useQuery({
    queryFn: () => getAllPosts("", 1, 12),
    queryKey: ["hero-posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const totalPostsCount = postsData?.headers?.["x-totalcount"]
    ? JSON.parse(postsData.headers["x-totalcount"])
    : null;

  const popularTags = useMemo(() => {
    const tagCounts = new Map();
    (postsData?.data || []).forEach((post) => {
      (post.tags || []).forEach((tag) => {
        const normalizedTag = typeof tag === "string" ? tag.trim() : "";
        if (!normalizedTag) return;
        tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1);
      });
    });

    if (tagCounts.size === 0) {
      (postsData?.data || []).forEach((post) => {
        (post.categories || []).forEach((category) => {
          const title = category?.title?.trim();
          if (!title) return;
          tagCounts.set(title, (tagCounts.get(title) || 0) + 1);
        });
      });
    }

    return [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [postsData]);

  const handleSearch = ({ SearchKeyboard }) => {
    const searchValue = SearchKeyboard?.trim();
    if (searchValue) {
      navigate(
        `/blog?search=${encodeURIComponent(searchValue)}&page=1`
      );
      return;
    }
    navigate("/blog?page=1");
  };

  const handleTagClick = (tag) => {
    navigate(`/blog?search=${encodeURIComponent(tag)}&page=1`);
  };

  return (
    <section className="container mx-auto px-5 py-10 lg:py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="font-rob text-3xl font-bold text-dark-soft md:text-5xl lg:text-4xl xl:text-5xl">
            Discover stories worth your time
          </h1>
        <p className="text-dark-light mt-4 md:text-xl lg:text-base xl:text-xl">
          {totalPostsCount !== null
            ? `Explore ${totalPostsCount} posts on product, design, engineering, and creator journeys. Find fresh ideas, practical guides, and honest lessons in every read.`
            : "Explore posts on product, design, engineering, and creator journeys. Find fresh ideas, practical guides, and honest lessons in every read."}
        </p>
        <Search
          className="mt-8 lg:mt-6 xl:mt-8"
          onSearchKeyboard={handleSearch}
        />

        <div className="mt-6 flex flex-col items-center gap-3 lg:mt-8 lg:flex-row lg:items-start">
          <span className="text-dark-light font-semibold italic lg:text-sm xl:text-base">
            Popular Tags:
          </span>
          {isError ? (
            <span className="text-sm text-red-600">Unable to load tags</span>
          ) : popularTags.length === 0 ? (
            <span className="text-sm text-dark-light">No tags yet</span>
          ) : (
            <ul className="flex flex-wrap justify-center gap-2 lg:justify-start lg:text-sm xl:text-base">
              {popularTags.map((tag) => (
                <li key={tag}>
                  <button
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="rounded-lg bg-primary bg-opacity-10 px-2 py-1.5 text-primary font-semibold"
                  >
                    {tag}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
        {/* rightimage  */}
        <div className="hidden lg:flex lg:justify-end">
          <img
            className="w-full max-w-xl"
            src={images.HeroImage3}
            alt="users are reading articles"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
