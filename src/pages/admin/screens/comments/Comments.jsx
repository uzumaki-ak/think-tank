import React from "react";
import { useDataTable } from "../../../../hooks/useDataTable";
import { deleteComment, getAllComments, updateComment } from "../../../../services/index/comments";
import DataTable from "../../components/DataTable";
import { images, stables } from "../../../../constants";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Comments = () => {
  const {
    userState,
    currentPage,
    searchKeyboard,
    data: commentsData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeyboardHandler,
    submitSearchKeyboardHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllComments(userState.userInfo.token, searchKeyboard, currentPage),
    dataQueryKey: "comments",
    deleteDataMessage: "COMMENT PURGED FROM ARCHIVE",
    mutateDeleteFn: ({ slug, token }) => {
      return deleteComment({ commentId: slug, token });
    },
  });

  const { mutate: mutateUpdateCommentCheck } = useMutation({
    mutationFn: ({ token, check, commentId }) => {
      return updateComment({ token, check, commentId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["comments"]);
      toast.success(data?.check ? "ACCESS GRANTED / COMMENT APPROVED" : "ACCESS REVOKED / COMMENT REJECTED");
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <DataTable
      pageTitle="Intelligence Feed"
      dalaListName="Incoming Communications"
      searchInputPlaceholder="Scan content / Keywords..."
      searchKeyboardOnSubmitHandler={submitSearchKeyboardHandler}
      searchkeyboardOnChangeHandler={searchKeyboardHandler}
      searchKeyboard={searchKeyboard}
      tableHeaderTitleList={["Origin", "Content", "Context / Post", "Timestamp", "Operations"]}
      isFetching={isFetching}
      isLoading={isLoading}
      data={commentsData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={commentsData?.headers}
    >
      {commentsData?.data.map((comment) => (
        <tr key={comment._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <div className="flex items-center gap-6">
              <img
                src={comment?.user?.avatar ? (comment.user.avatar.startsWith("http") ? comment.user.avatar : stables.UPLOAD_FOLDER_BASE_URL + comment.user.avatar) : images.userImage}
                alt={comment?.user?.name}
                className="w-10 h-10 object-cover border-thin grayscale group-hover:grayscale-0 transition-all"
              />
              <span className="font-syne font-bold text-sm uppercase tracking-tight">{comment?.user?.name}</span>
            </div>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10 max-w-xs">
            {comment?.replyOnUser && (
              <p className="font-ibm text-[9px] opacity-30 uppercase mb-2">
                Reply to: <span className="opacity-100">{comment?.replyOnUser?.name}</span>
              </p>
            )}
            <p className="font-inter text-sm opacity-60 leading-relaxed line-clamp-3">{comment?.desc}</p>
          </td>

          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <Link to={`/blog/${comment?.post?.slug}`} className="font-bricolage text-[11px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
              {comment?.post?.title || "Archive Entry"}
            </Link>
          </td>

          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <span className="font-ibm text-xs opacity-60">
              {new Date(comment?.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </td>

          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <div className="flex gap-6 items-center">
              <button
                className={`font-geist text-[10px] tracking-widest uppercase transition-all ${
                  comment?.check ? "text-orange-500" : "text-green-500"
                } hover:opacity-50`}
                onClick={() => mutateUpdateCommentCheck({
                  token: userState.userInfo.token,
                  check: !comment?.check,
                  commentId: comment?._id,
                })}
              >
                {comment?.check ? "[Reject]" : "[Approve]"}
              </button>
              <button
                disabled={isLoadingDeleteData}
                className="font-geist text-[10px] tracking-widest uppercase text-red-500 hover:text-red-700 disabled:opacity-20 transition-colors"
                onClick={() => deleteDataHandler({ slug: comment?._id, token: userState.userInfo.token })}
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

export default Comments;

