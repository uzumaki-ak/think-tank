import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { updateBookmark } from "../services/index/users";
import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import toast from "react-hot-toast";

const BookmarkButton = ({ postId }) => {
  const userState = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ token, postId }) => {
      return updateBookmark({ token, postId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      toast.success("ARCHIVE STATE UPDATED");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isBookmarked = userState?.userInfo?.bookmarks?.includes(postId);

  const handleBookmark = () => {
    if (!userState.userInfo) {
      toast.error("PROTOCOL ERROR / AUTHENTICATION REQUIRED");
      return;
    }
    mutate({ token: userState.userInfo.token, postId });
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={isLoading}
      className="flex items-center gap-3 px-4 py-2 border-thin border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all group disabled:opacity-30"
    >
      <span className="opacity-40 group-hover:opacity-100 transition-opacity">
        {isBookmarked ? <RiBookmarkFill size={16} /> : <RiBookmarkLine size={16} />}
      </span>
      <span className="font-geist text-[8px] tracking-[0.2em] uppercase opacity-30 group-hover:opacity-100 transition-opacity">
        {isBookmarked ? "[Archived]" : "[Archive]"}
      </span>
    </button>
  );
};

export default BookmarkButton;
