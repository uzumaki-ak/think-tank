import React from "react";
import { useDataTable } from "../../../../hooks/useDataTable";
import { deleteUser, getAllUsers, updateProfile } from "../../../../services/index/users";
import DataTable from "../../components/DataTable";
import { images, stables } from "../../../../constants";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Users = () => {
  const {
    userState,
    currentPage,
    searchKeyboard,
    data: usersData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeyboardHandler,
    submitSearchKeyboardHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllUsers(userState.userInfo.token, searchKeyboard, currentPage),
    dataQueryKey: "users",
    deleteDataMessage: "USER RECORD REMOVED",
    mutateDeleteFn: ({ slug, token }) => {
      return deleteUser({ slug, token });
    },
  });

  const { mutate: mutateUpdateUser, isLoading: isLoadingUpdateUser } = useMutation({
    mutationFn: ({ isAdmin, userId }) => {
      return updateProfile({
        token: userState.userInfo.token,
        userData: { admin: isAdmin },
        userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("PERMISSION LEVEL UPDATED");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleAdminCheck = (event, userId) => {
    if (window.confirm("CONFIRM PERMISSION ESCALATION / DE-ESCALATION?")) {
      mutateUpdateUser({ isAdmin: event.target.checked, userId });
    } else {
      event.target.checked = !event.target.checked;
    }
  };

  return (
    <DataTable
      pageTitle="Network Nodes"
      dalaListName="User Directory"
      searchInputPlaceholder="Identification / Email..."
      searchKeyboardOnSubmitHandler={submitSearchKeyboardHandler}
      searchkeyboardOnChangeHandler={searchKeyboardHandler}
      searchKeyboard={searchKeyboard}
      tableHeaderTitleList={["Identity", "Identification", "Establishment", "Status", "Privilege", "Action"]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={usersData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={usersData?.headers}
      userState={userState}
    >
      {usersData?.data.map((user) => (
        <tr key={user._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <div className="flex items-center gap-6">
              <img
                src={user?.avatar ? (user.avatar.startsWith("http") ? user.avatar : stables.UPLOAD_FOLDER_BASE_URL + user.avatar) : images.userImage}
                alt={user.name}
                className="w-10 h-10 object-cover border-thin grayscale group-hover:grayscale-0 transition-all"
              />
              <span className="font-syne font-bold text-sm uppercase tracking-tight">{user.name}</span>
            </div>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <span className="font-ibm text-xs opacity-60 lowercase tracking-tight">{user.email}</span>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <span className="font-ibm text-xs opacity-60">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <span className={`font-geist text-[9px] tracking-widest uppercase ${user.verified ? "text-green-500" : "text-red-500"}`}>
              {user.verified ? "[VERIFIED]" : "[UNVERIFIED]"}
            </span>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <input
              type="checkbox"
              className="w-4 h-4 rounded-none accent-matte-black dark:accent-bone transition-all"
              defaultChecked={user.admin}
              onChange={(event) => handleAdminCheck(event, user._id)}
              disabled={isLoadingUpdateUser}
            />
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <button
              disabled={isLoadingDeleteData}
              className="font-geist text-[10px] tracking-widest uppercase text-red-500 hover:text-red-700 disabled:opacity-20 transition-colors"
              onClick={() => deleteDataHandler({ slug: user?._id, token: userState.userInfo.token })}
            >
              [TERMINATE]
            </button>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};

export default Users;

