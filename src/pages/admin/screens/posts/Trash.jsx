import React from "react";
import { useDataTable } from "../../../../hooks/useDataTable";
import { getAllPosts, restorePost, hardDeletePost } from "../../../../services/index/posts";
import DataTable from "../../components/DataTable";
import { stables, images } from "../../../../constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Trash = () => {
  const queryClient = useQueryClient();
  const {
    userState,
    currentPage,
    searchKeyboard,
    data: postsData,
    isLoading,
    isFetching,
    searchKeyboardHandler,
    submitSearchKeyboardHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllPosts(searchKeyboard, currentPage, 10, [], true),
    dataQueryKey: "archived-posts",
  });

  const { mutate: mutateRestore, isLoading: isLoadingRestore } = useMutation({
    mutationFn: ({ slug, token }) => {
      return restorePost({ slug, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["archived-posts"]);
      queryClient.invalidateQueries(["posts"]);
      toast.success("DATA NODE RESTORED TO SYSTEM");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: mutateHardDelete, isLoading: isLoadingHardDelete } = useMutation({
    mutationFn: ({ slug, token }) => {
      return hardDeletePost({ slug, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["archived-posts"]);
      toast.success("DATA NODE PERMANENTLY EXPUNGED");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <DataTable
      pageTitle="System Recycle Bin"
      dalaListName="Archived Intelligence"
      searchInputPlaceholder="Search archived..."
      searchKeyboardOnSubmitHandler={submitSearchKeyboardHandler}
      searchkeyboardOnChangeHandler={searchKeyboardHandler}
      searchKeyboard={searchKeyboard}
      tableHeaderTitleList={["Archive / Title", "Category", "Deletion Date", "Operations"]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={postsData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={postsData?.headers}
      userState={userState}
    >
      {postsData?.data.map((post) => (
        <tr key={post._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <div className="flex items-center gap-6">
              <img
                src={post?.photo ? (post.photo.startsWith("http") ? post.photo : stables.UPLOAD_FOLDER_BASE_URL + post.photo) : images.samplePostImage}
                alt={post.title}
                className="w-12 h-12 object-cover border-thin grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
              />
              <div>
                <p className="font-syne font-bold text-sm uppercase tracking-tight opacity-40 group-hover:opacity-100 transition-opacity">{post.title}</p>
                <span className="font-ibm text-[9px] opacity-20 uppercase">{post.slug}</span>
              </div>
            </div>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <span className="font-bricolage text-xs uppercase tracking-widest opacity-40">
              {post.categories.length > 0 ? post.categories[0].title : "Uncategorized"}
            </span>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <span className="font-ibm text-xs opacity-40">
              {new Date(post.updatedAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <div className="flex gap-6 items-center">
              <button
                disabled={isLoadingRestore}
                onClick={() => mutateRestore({ slug: post.slug, token: userState.userInfo.token })}
                className="font-geist text-[10px] tracking-widest uppercase text-green-500/60 hover:text-green-500 transition-colors disabled:opacity-20"
              >
                [Restore]
              </button>
              <button
                disabled={isLoadingHardDelete}
                onClick={() => {
                   if(window.confirm("CRITICAL: PERMANENT DELETION IS IRREVERSIBLE. CONTINUE?")) {
                      mutateHardDelete({ slug: post.slug, token: userState.userInfo.token })
                   }
                }}
                className="font-geist text-[10px] tracking-widest uppercase text-red-500 hover:text-red-700 disabled:opacity-20 transition-colors"
              >
                [Expunge]
              </button>
            </div>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};

export default Trash;
