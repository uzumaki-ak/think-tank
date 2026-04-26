import { stables } from "../../../../constants";
import { images } from "../../../../constants";
import { deletePost, getAllPosts } from "../../../../services/index/posts";
import { Link } from "react-router-dom";
import { useDataTable } from "../../../../hooks/useDataTable";
import DataTable from "../../components/DataTable";

const ManagePost = () => {
  const {
    userState,
    currentPage,
    searchKeyboard,
    data: postsData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    searchKeyboardHandler,
    submitSearchKeyboardHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllPosts(searchKeyboard, currentPage),
    dataQueryKey: "posts",
    deleteDataMessage: "POST MOVED TO ARCHIVE",
    mutateDeleteFn: ({ slug, token }) => {
      return deletePost({ slug, token });
    },
  });

  return (
    <div>
      <div className="flex justify-end mb-8">
        <Link 
          to="/admin/posts/trash" 
          className="font-bricolage text-[10px] tracking-[0.2em] uppercase border-thin border-black/10 dark:border-white/10 px-6 py-3 hover:bg-red-500/10 hover:border-red-500/50 transition-all text-red-500/60 hover:text-red-500"
        >
          Access Recycle Bin / Trash
        </Link>
      </div>
      <DataTable
      pageTitle="Release Management"
      dalaListName="Archive Inventory"
      searchInputPlaceholder="Search by title..."
      searchKeyboardOnSubmitHandler={submitSearchKeyboardHandler}
      searchkeyboardOnChangeHandler={searchKeyboardHandler}
      searchKeyboard={searchKeyboard}
      tableHeaderTitleList={["Archive / Title", "Category", "Release Date", "Views", "Operations"]}
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
                className="w-12 h-12 object-cover border-thin grayscale group-hover:grayscale-0 transition-all"
              />
              <div>
                <p className="font-syne font-bold text-sm uppercase tracking-tight">{post.title}</p>
                <span className="font-ibm text-[9px] opacity-30 uppercase">{post.slug}</span>
              </div>
            </div>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <span className="font-bricolage text-xs uppercase tracking-widest opacity-60">
              {post.categories.length > 0 ? post.categories[0].title : "Uncategorized"}
            </span>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <span className="font-ibm text-xs opacity-60">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10 text-center">
            <span className="font-ibm text-xs font-bold">{post.views || 0}</span>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <div className="flex gap-6 items-center">
              <Link
                to={`/admin/posts/manage/edit/${post?.slug}`}
                className="font-geist text-[10px] tracking-widest uppercase hover:opacity-50 transition-opacity"
              >
                [Edit]
              </Link>
              <button
                disabled={isLoadingDeleteData}
                className="font-geist text-[10px] tracking-widest uppercase text-red-500 hover:text-red-700 disabled:opacity-20 transition-colors"
                onClick={() => deleteDataHandler({ slug: post?.slug, token: userState.userInfo.token })}
              >
                [Archive]
              </button>
            </div>
          </td>
        </tr>
      ))}
      </DataTable>
    </div>
  );
};

export default ManagePost;
