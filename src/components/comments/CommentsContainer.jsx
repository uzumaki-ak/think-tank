import React, { useState } from "react";
import { useSelector } from "react-redux";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewComment, deleteComment, updateComment } from "../../services/index/comments";
import { toast } from "react-hot-toast";

const CommentsContainer = ({
  className,
  logginedUserId,
  comments = [],
  postSlug,
}) => {
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);
  const [affectedComment, setAffectedComment] = useState(null);

  const { mutate: mutateNewComment, isLoading: isLoadingNewComment } = useMutation({
    mutationFn: ({ token, desc, slug, parent, replyOnUser }) => {
      return createNewComment({ token, desc, slug, parent, replyOnUser });
    },
    onSuccess: () => {
      toast.success("TRANSMISSION QUEUED / AWAITING VERIFICATION");
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutate: mutateUpdateComment } = useMutation({
    mutationFn: ({ token, desc, commentId }) => {
      return updateComment({ token, desc, commentId });
    },
    onSuccess: () => {
      toast.success("ENTRY MODIFIED SUCCESSFULLY");
      queryClient.invalidateQueries(["blog", postSlug]);
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutate: mutateDeleteComment } = useMutation({
    mutationFn: ({ token, commentId }) => {
      return deleteComment({ token, commentId });
    },
    onSuccess: () => {
      toast.success("ENTRY REMOVED FROM LOG");
      queryClient.invalidateQueries(["blog", postSlug]);
    },
    onError: (error) => toast.error(error.message),
  });

  const addCommentHandler = (value, parent = null, replyOnUser = null) => {
    mutateNewComment({
      desc: value,
      parent,
      replyOnUser,
      token: userState.userInfo?.token || "",
      slug: postSlug,
    });
    setAffectedComment(null);
  };

  const deleteCommentHandler = (commentId) => {
    mutateDeleteComment({ token: userState.userInfo?.token || "", commentId });
  };

  const updateCommentHandler = (value, commentId) => {
    mutateUpdateComment({
      token: userState.userInfo?.token || "",
      desc: value,
      commentId,
    });
    setAffectedComment(null);
  };

  return (
    <div className={`${className} animate-in fade-in duration-700`}>
      <div className="mb-12 flex justify-between items-end">
        <div>
          <span className="font-geist text-[9px] tracking-[0.4em] uppercase opacity-30 mb-2 block">Data Feed / Incoming</span>
          <h2 className="font-syne font-bold text-3xl uppercase tracking-tighter">Communications</h2>
        </div>
        <span className="font-ibm text-[10px] tracking-widest uppercase opacity-40">
          Nodes: {comments.length}
        </span>
      </div>

      <div className="border-thin border-black/10 dark:border-white/10 p-8 mb-16 bg-black/5 dark:bg-white/5">
        <CommentForm
          btnLable="TRANSMIT"
          formSubmitHandler={(value) => addCommentHandler(value)}
          loading={isLoadingNewComment}
        />
      </div>

      <div className="space-y-12">
        {comments.length === 0 ? (
          <div className="py-20 text-center border-thin border-dashed border-black/10 dark:border-white/10">
            <span className="font-ibm text-[10px] tracking-widest uppercase opacity-20">NO RECENT TRANSMISSIONS</span>
          </div>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              logginedUserId={logginedUserId}
              affectedComment={affectedComment}
              setAffectedComment={setAffectedComment}
              addComment={addCommentHandler}
              updateComment={updateCommentHandler}
              deleteComment={deleteCommentHandler}
              replies={comment.replies}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsContainer;

