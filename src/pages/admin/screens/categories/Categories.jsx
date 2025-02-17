import React, { useState } from "react";
import { useDataTable } from "../../../../hooks/useDataTable";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../../../../services/index/postCategories";
import DataTable from "../../components/DataTable";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Categories = () => {
  const [categoryTitle, setCategoryTitle] = useState("");

  const { mutate: mutateCreateCategory, isloading: isLoadingCreateCategory } =
  useMutation({
    mutationFn: ({ token, title }) => {
      return createCategory({
        token,
        title,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("Category created :>");
     
    },
    onError: (error) => {
      toast.error(error.message);

      console.log(error);
    },
  });

  const {
    userState,
    currentPage,
    searchKeyboard,
    data: categoriesData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeyboardHandler,
    submitSearchKeyboardHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllCategories(searchKeyboard, currentPage),
    dataQueryKey: "categories",
    deleteDataMessage: "category deleted successfully",
    mutateDeleteFn: ({ slug, token }) => {
      return deleteCategory({
        slug,
        token,
      });
    },
  });

  const handleCreateCategory = () => {
    mutateCreateCategory({
      token: userState.userInfo.token,
      title: categoryTitle,
    })
  }

  return (
    <div className="grid grid-cols-12 gap-x-4 ">
      <div className="col-span-4 py-8">
        <h4 className="text-lg leading-tight">Add New Category</h4>
        <div className="d-form-control w-full mt-6">
          <input
            value={categoryTitle}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-rob font-medium text-dark-hard "
            onChange={(e) => setCategoryTitle(e.target.value)}
            placeholder="category title"
          />
          <button
              disabled={isLoadingCreateCategory}
              type="button"
              onClick={handleCreateCategory}
              className="w-fit mt-3 bg-emerald-600 text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
             Add Category
            </button>
        </div>
      </div>
      <div className="col-span-8 ">
        <DataTable
          pageTitle=""
          dataListName="Categories"
          searchInputPlaceholder="Category title..."
          searchKeyboardOnSubmitHandler={submitSearchKeyboardHandler}
          searchkeyboardOnChangeHandler={searchKeyboardHandler}
          searchKeyboard={searchKeyboard}
          tableHeaderTitleList={["Title", "Created At", ""]}
          isLoading={isLoading}
          isFetching={isFetching}
          data={categoriesData?.data}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          headers={categoriesData?.headers}
          userState={userState}
        >
          {categoriesData?.data.map((category) => (
            <tr>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <div className="flex items-center">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {category.title}
                  </p>
                </div>
              </td>

              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p className="text-gray-900 whitespace-no-wrap">
                  {new Date(category.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </td>

              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
                <button
                  disabled={isLoadingDeleteData}
                  type="button"
                  className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={() => {
                    deleteDataHandler({
                      slug: category?._id,
                      token: userState.userInfo.token,
                    });
                  }}
                >
                  Delete
                </button>
                <Link
                  to={`/admin/categories/manage/edit/${category?._id}`}
                  className="text-green-600 hover:text-green-900"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
};

export default Categories;
