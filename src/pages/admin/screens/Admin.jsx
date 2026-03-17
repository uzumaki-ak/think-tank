import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { getAllPosts } from "../../../services/index/posts";
import { getAllComments } from "../../../services/index/comments";
import { getAllUsers } from "../../../services/index/users";
import { getAllCategories } from "../../../services/index/postCategories";
import { stables, images } from "../../../constants";

const Admin = () => {
  const userState = useSelector((state) => state.user);
  const token = userState.userInfo?.token || "";

  const parseTotalCount = (headers) => {
    const raw = headers?.["x-totalcount"];
    if (raw === undefined || raw === null) return null;
    try {
      return Number(JSON.parse(raw));
    } catch (error) {
      return Number(raw);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery({
    queryFn: () => getAllPosts("", 1, 50),
    queryKey: ["admin-posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError,
  } = useQuery({
    queryFn: () => getAllComments(token, "", 1, 50),
    queryKey: ["admin-comments", token],
    enabled: Boolean(token),
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryFn: () => getAllUsers(token, "", 1, 50),
    queryKey: ["admin-users", token],
    enabled: Boolean(token),
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryFn: () => getAllCategories("", 1, 50),
    queryKey: ["admin-categories"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const totalPosts = parseTotalCount(postsData?.headers);
  const totalComments = parseTotalCount(commentsData?.headers);
  const totalUsers = parseTotalCount(usersData?.headers);
  const totalCategories = parseTotalCount(categoriesData?.headers);

  const pendingComments =
    commentsData?.data?.filter((comment) => !comment.check).length || 0;

  const recentPosts = postsData?.data?.slice(0, 6) || [];
  const recentComments = commentsData?.data?.slice(0, 6) || [];
  const recentUsers = usersData?.data?.slice(0, 6) || [];

  const postsByMonth = useMemo(() => {
    const labels = [];
    const counts = Array(6).fill(0);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    for (let i = 0; i < 6; i += 1) {
      const date = new Date(start.getFullYear(), start.getMonth() + i, 1);
      labels.push(
        date.toLocaleDateString("en-IN", {
          month: "short",
        })
      );
    }

    (postsData?.data || []).forEach((post) => {
      if (!post?.createdAt) return;
      const createdAt = new Date(post.createdAt);
      const monthIndex =
        (createdAt.getFullYear() - start.getFullYear()) * 12 +
        (createdAt.getMonth() - start.getMonth());
      if (monthIndex >= 0 && monthIndex < 6) {
        counts[monthIndex] += 1;
      }
    });

    return { labels, counts };
  }, [postsData]);

  const commentStatus = useMemo(() => {
    const list = commentsData?.data || [];
    const approved = list.filter((comment) => comment.check).length;
    const pending = list.length - approved;
    return { approved, pending, total: list.length };
  }, [commentsData]);

  const approvedPercent = commentStatus.total
    ? Math.round((commentStatus.approved / commentStatus.total) * 100)
    : 0;

  const topCategories = useMemo(() => {
    const categoryCounts = new Map();
    (postsData?.data || []).forEach((post) => {
      (post.categories || []).forEach((category) => {
        const title = category?.title?.trim();
        if (!title) return;
        categoryCounts.set(title, (categoryCounts.get(title) || 0) + 1);
      });
    });

    return [...categoryCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, count]) => ({ title, count }));
  }, [postsData]);

  const maxPostsByMonth = Math.max(...postsByMonth.counts, 1);
  const hasPostsByMonth = postsByMonth.counts.some((count) => count > 0);
  const maxCategoryCount = topCategories.length
    ? Math.max(...topCategories.map((item) => item.count))
    : 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dark-soft">
            Admin Dashboard
          </h1>
          <p className="text-sm text-dark-light">
            A quick overview of what is happening in your blog right now.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/posts/manage"
            className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Manage Posts
          </Link>
          <Link
            to="/admin/comments"
            className="rounded-lg border border-dark-light px-4 py-2 text-sm font-semibold text-dark-light transition hover:border-dark-soft hover:text-dark-soft"
          >
            Review Comments
          </Link>
          <Link
            to="/admin/users/manage"
            className="rounded-lg border border-dark-light px-4 py-2 text-sm font-semibold text-dark-light transition hover:border-dark-soft hover:text-dark-soft"
          >
            Users
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-dark-light">Total Posts</p>
          <h3 className="mt-2 text-2xl font-semibold text-dark-soft">
            {postsLoading ? "..." : totalPosts ?? "--"}
          </h3>
          <p className="mt-2 text-xs text-dark-light">
            {postsError ? "Unable to load posts" : "Published and draft posts"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-dark-light">Total Comments</p>
          <h3 className="mt-2 text-2xl font-semibold text-dark-soft">
            {commentsLoading ? "..." : totalComments ?? "--"}
          </h3>
          <p className="mt-2 text-xs text-dark-light">
            {commentsError ? "Unable to load comments" : "Across all posts"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-dark-light">Pending Reviews</p>
          <h3 className="mt-2 text-2xl font-semibold text-dark-soft">
            {commentsLoading ? "..." : pendingComments}
          </h3>
          <p className="mt-2 text-xs text-dark-light">
            Comments waiting for approval
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-dark-light">Total Users</p>
          <h3 className="mt-2 text-2xl font-semibold text-dark-soft">
            {usersLoading ? "..." : totalUsers ?? "--"}
          </h3>
          <p className="mt-2 text-xs text-dark-light">
            {usersError ? "Unable to load users" : "Registered accounts"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark-soft">
              Publishing Cadence
            </h2>
            <span className="text-xs text-dark-light">Last 6 months</span>
          </div>
          <div className="mt-6">
            {postsLoading ? (
              <p className="text-sm text-dark-light">Loading activity...</p>
            ) : postsError ? (
              <p className="text-sm text-red-600">Could not load posts.</p>
            ) : !hasPostsByMonth ? (
              <p className="text-sm text-dark-light">No recent posts yet.</p>
            ) : (
              <div className="flex items-end justify-between gap-3">
                {postsByMonth.counts.map((count, index) => {
                  const height = Math.max(
                    10,
                    Math.round((count / maxPostsByMonth) * 100)
                  );
                  return (
                    <div
                      key={postsByMonth.labels[index]}
                      className="flex flex-1 flex-col items-center gap-2"
                    >
                      <div className="flex h-24 w-3 items-end overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="w-full rounded-full bg-primary"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-xs text-dark-light">
                        {postsByMonth.labels[index]}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark-soft">
              Comment Review Status
            </h2>
            <span className="text-xs text-dark-light">Recent comments</span>
          </div>
          <div className="mt-6">
            {commentsLoading ? (
              <p className="text-sm text-dark-light">Loading comments...</p>
            ) : commentsError ? (
              <p className="text-sm text-red-600">
                Could not load comments.
              </p>
            ) : commentStatus.total === 0 ? (
              <p className="text-sm text-dark-light">
                No comment activity yet.
              </p>
            ) : (
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <div
                  className="relative h-28 w-28 rounded-full"
                  style={{
                    background: `conic-gradient(#22c55e 0 ${approvedPercent}%, #f97316 ${approvedPercent}% 100%)`,
                  }}
                >
                  <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center">
                    <span className="text-xs font-semibold text-dark-soft">
                      {commentStatus.total} total
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    <span className="text-dark-soft">
                      Approved: {commentStatus.approved}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                    <span className="text-dark-soft">
                      Pending: {commentStatus.pending}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark-soft">
              Top Categories
            </h2>
            <span className="text-xs text-dark-light">By posts</span>
          </div>
          <div className="mt-6 space-y-4">
            {postsLoading ? (
              <p className="text-sm text-dark-light">Loading categories...</p>
            ) : postsError ? (
              <p className="text-sm text-red-600">
                Could not load categories.
              </p>
            ) : topCategories.length === 0 ? (
              <p className="text-sm text-dark-light">
                No category activity yet.
              </p>
            ) : (
              topCategories.map((category) => (
                <div key={category.title} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-soft">{category.title}</span>
                    <span className="text-dark-light">{category.count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${Math.max(
                          8,
                          Math.round((category.count / maxCategoryCount) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-dark-soft">
                Recent Posts
              </h2>
              <Link
                to="/admin/posts/manage"
                className="text-sm font-semibold text-primary"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-4">
              {postsLoading ? (
                <p className="text-sm text-dark-light">Loading posts...</p>
              ) : postsError ? (
                <p className="text-sm text-red-600">Could not load posts.</p>
              ) : recentPosts.length ? (
                recentPosts.map((post) => (
                  <div
                    key={post._id}
                    className="flex flex-col gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
                  >
                    <img
                      src={
                        post?.photo
                          ? stables.UPLOAD_FOLDER_BASE_URL + post.photo
                          : images.samplePostImage
                      }
                      alt={post.title}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-dark-soft">
                        {post.title}
                      </p>
                      <p className="text-xs text-dark-light">
                        {post.categories?.length
                          ? post.categories
                              .slice(0, 2)
                              .map((category) => category.title)
                              .join(", ")
                          : "Uncategorized"}{" "}
                        - {formatDate(post.createdAt)}
                      </p>
                    </div>
                    <Link
                      to={`/admin/posts/manage/edit/${post.slug}`}
                      className="text-sm font-semibold text-primary"
                    >
                      Edit
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-dark-light">No posts yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-dark-soft">
                Recent Comments
              </h2>
              <Link
                to="/admin/comments"
                className="text-sm font-semibold text-primary"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-4">
              {commentsLoading ? (
                <p className="text-sm text-dark-light">Loading comments...</p>
              ) : commentsError ? (
                <p className="text-sm text-red-600">
                  Could not load comments.
                </p>
              ) : recentComments.length ? (
                recentComments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex flex-col gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
                  >
                    <img
                      src={
                        comment?.user?.avatar
                          ? stables.UPLOAD_FOLDER_BASE_URL +
                            comment.user.avatar
                          : images.userImage
                      }
                      alt={comment?.user?.name || "User"}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-dark-soft">
                        {comment?.user?.name || "Anonymous"}
                        <span className="ml-2 text-xs text-dark-light">
                          {formatDate(comment.createdAt)}
                        </span>
                      </p>
                      <p className="text-sm text-dark-light line-clamp-2">
                        {comment.desc}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        comment.check
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}
                    >
                      {comment.check ? "Approved" : "Pending"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-dark-light">No comments yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-dark-soft">
              Recent Users
            </h2>
            <div className="mt-4 space-y-4">
              {usersLoading ? (
                <p className="text-sm text-dark-light">Loading users...</p>
              ) : usersError ? (
                <p className="text-sm text-red-600">Could not load users.</p>
              ) : recentUsers.length ? (
                recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={
                        user?.avatar
                          ? stables.UPLOAD_FOLDER_BASE_URL + user.avatar
                          : images.userImage
                      }
                      alt={user.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-dark-soft">
                        {user.name}
                      </p>
                      <p className="text-xs text-dark-light">{user.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-dark-light">No users yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-dark-soft">
                Categories
              </h2>
              <span className="text-xs text-dark-light">
                {categoriesLoading ? "..." : totalCategories ?? "--"} total
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categoriesLoading ? (
                <p className="text-sm text-dark-light">Loading categories...</p>
              ) : categoriesError ? (
                <p className="text-sm text-red-600">
                  Could not load categories.
                </p>
              ) : categoriesData?.data?.length ? (
                categoriesData.data.slice(0, 10).map((category) => (
                  <span
                    key={category._id}
                    className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-semibold text-primary"
                  >
                    {category.title}
                  </span>
                ))
              ) : (
                <p className="text-sm text-dark-light">No categories yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
