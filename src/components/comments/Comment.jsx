import React from "react";
import { images, stables } from "../../constants";
import CommentForm from "./CommentForm";

const Comment = ({
  comment,
  logginedUserId,
  affectedComment,
  setAffectedComment,
  addComment,
  parentId = null,
  updateComment,
  deleteComment,
  replies = [],
}) => {
  const isUserLoggined = Boolean(logginedUserId);
  const commentBelongsToUser = logginedUserId === (comment?.user?._id || "");
  const isReplying =
    affectedComment &&
    affectedComment.type === "replying" &&
    affectedComment._id === (comment?._id || "");
  const isEditing =
    affectedComment &&
    affectedComment.type === "editing" &&
    affectedComment._id === (comment?._id || "");
  const repliedCommentId = parentId ? parentId : comment?._id || "";
  const replyOnUserId = comment?.user?._id || "";

  return (
    <div
      className="flex flex-nowrap items-start gap-x-6 bg-transparent"
      id={`comment-${comment?._id}`}
    >
      <img
        src={comment?.user?.avatar ? (comment.user.avatar.startsWith("http") ? comment.user.avatar : stables.UPLOAD_FOLDER_BASE_URL + comment.user.avatar) : images.userImage}
        alt="user node"
        className="w-10 h-10 object-cover border-thin grayscale hover:grayscale-0 transition-all"
      />

      <div className="flex-1 flex flex-col border-b-thin border-black/5 dark:border-white/5 pb-8">
        <div className="flex justify-between items-start mb-2">
          <h5 className="font-syne font-bold text-sm uppercase tracking-tight">
            {comment?.user?.name || "ANONYMOUS NODE"}
          </h5>
          <span className="font-ibm text-[9px] tracking-widest uppercase opacity-30">
            {comment?.createdAt ? new Date(comment.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
          </span>
        </div>

        {!isEditing && (
          <p className="font-inter text-sm opacity-60 leading-relaxed mb-6">
            {comment?.desc || ""}
          </p>
        )}

        {isEditing && (
          <div className="mb-6">
            <CommentForm
              btnLable="UPDATE"
              formSubmitHandler={(value) => updateComment(value, comment._id)}
              formCancelHandler={() => setAffectedComment(null)}
              initialText={comment?.desc || ""}
            />
          </div>
        )}

        <div className="flex items-center gap-6">
          {isUserLoggined && (
            <button
              className="font-geist text-[9px] tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity"
              onClick={() => setAffectedComment({ type: "replying", _id: comment?._id || "" })}
            >
              [Reply]
            </button>
          )}
          {commentBelongsToUser && (
            <>
              <button
                className="font-geist text-[9px] tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity"
                onClick={() => setAffectedComment({ type: "editing", _id: comment._id })}
              >
                [Edit]
              </button>
              <button
                className="font-geist text-[9px] tracking-[0.2em] uppercase text-red-500 opacity-40 hover:opacity-100 transition-opacity"
                onClick={() => deleteComment(comment?._id || "")}
              >
                [Expunge]
              </button>
            </>
          )}
        </div>

        {isReplying && (
          <div className="mt-8">
            <CommentForm
              btnLable="TRANSMIT"
              formSubmitHandler={(value) => addComment(value, repliedCommentId, replyOnUserId)}
              formCancelHandler={() => setAffectedComment(null)}
            />
          </div>
        )}

        {replies.length > 0 && (
          <div className="mt-12 pl-12 border-l-thin border-black/10 dark:border-white/10 space-y-12">
            {replies.map((reply) => (
              <Comment
                key={reply._id}
                addComment={addComment}
                affectedComment={affectedComment}
                setAffectedComment={setAffectedComment}
                comment={reply}
                deleteComment={deleteComment}
                logginedUserId={logginedUserId}
                replies={[]}
                updateComment={updateComment}
                parentId={comment?._id || ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;

