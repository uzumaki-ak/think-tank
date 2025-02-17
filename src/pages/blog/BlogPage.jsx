// import React, { useEffect, useState } from "react";
// import { getAllPosts } from "../../services/index/posts";
// import { useQuery } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import ArticleCardSkeleton from "../../components/ArticleCardSkeleton";
// import ErrorMessage from "../../components/ErrorMessage";
// import ArticleCard from "../../components/ArticleCard";
// import MainLayout from "../../components/MainLayout";
// import Pagination from "../../components/Pagination";
// import { useSearchParams } from "react-router-dom";

// let isFirstRun = true;

// const BlogPage = () => {
//   const { searchParams, setSearchParams } = useSearchParams();

//   const searchParamsValue = Object.fromEntries([...searchParams]);

//   const [currentPage, setCurrentPage] = useState(
//     parseInt(searchParamsValue?.page) || 1
//   );

//   const { data, isLoading, isError, refetch } = useQuery({
//     queryFn: () => getAllPosts("", currentPage, 8),
//     queryKey: ["posts"],
//     onError: (error) => {
//       toast.error(error.message);
//       console.log(error);
//     },
//   });

//   useEffect(() => {
//     if (isFirstRun) {
//       isFirstRun = false;
//       return;
//     }
//     window.scrollTo(0, 0);
//     refetch();
//   }, [currentPage, refetch]);

//   return (
//     <MainLayout>
//       <section className="flex flex-col container mx-auto  px-5 py-10 ">
//         <div className="flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
//           {isLoading ? (
//             [...Array(3)].map((item, index) => (
//               <ArticleCardSkeleton
//                 key={index}
//                 className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33% - 21px)]"
//               />
//             ))
//           ) : isError ? (
//             <ErrorMessage message="could not fetch post data sorry for inconv:( " />
//           ) : (
//             data?.data.map((post) => (
//               <ArticleCard
//                 key={post._id}
//                 post={post}
//                 className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33% - 21px)] "
//               />
//             ))
//           )}
//           {/* <ArticleCard className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33% - 21px)]" /> */}
//         </div>
//         {!isLoading && (
//           <Pagination
//             onPageChange={(page) => setCurrentPage(page)}
//             currentPage={currentPage}
//             totalPageCount={JSON.parse(data?.headers?.["x-totalpagecount"])}
//           />
//         )}
//       </section>
//     </MainLayout>
//   );
// };

// export default BlogPage;

import React, { useEffect, useState } from "react";
import { getAllPosts } from "../../services/index/posts";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ArticleCardSkeleton from "../../components/ArticleCardSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import ArticleCard from "../../components/ArticleCard";
import MainLayout from "../../components/MainLayout";
import Pagination from "../../components/Pagination";
import { useSearchParams } from "react-router-dom";
import Search from "../../components/Search";
import AsyncMultiSelectTagDropdown from "../../components/SelectAsyncPaginate";
import { getAllCategories } from "../../services/index/postCategories";
import { filterCategories } from "../../utils/multiSelectTagUtils";

let isFirstRun = true;

const promiseOptions = async (search, loadedOptions, { page }) => {
  const { data: categoriesData, headers } = await getAllCategories(
    search,
    page,
    
  );
  return {
    options: filterCategories(search, categoriesData),
    hasMore:
      parseInt(headers["x-totalpagecount"]) !==
      parseInt(headers["x-currentPage"]),
    // hasMore: ["x-currentPage"] < ["x-totalpagecount"],
    additional: {
      page: page + 1,
    },
  };
};

const BlogPage = () => {

  
  // Destructure searchParams from useSearchParams correctly
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([])

  // Convert searchParams to an object
  const searchParamsValue = Object.fromEntries(searchParams.entries());

  const currentPage = parseInt(searchParamsValue?.page) || 1;

  const SearchKeyboard = searchParamsValue?.search || "";

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () => getAllPosts(SearchKeyboard, currentPage, 8, categories),
    queryKey: ["posts", categories], // include currentPage in the key to refetch when it changes
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    refetch();
  }, [currentPage, SearchKeyboard, refetch]);

  const handlePageChange = (page) => {
    //change page query string in url

    setSearchParams({ page, search: SearchKeyboard });
  };

  const handleSearch = ({ SearchKeyboard }) => {
    setSearchParams({ page: 1, search: SearchKeyboard });
  };

  return (
    <MainLayout>
      <section className="flex flex-col container mx-auto px-5 py-10">
        <div className="flex flex-col mb-10 space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:gap-x-4">
          <Search
            className="w-full max-w-xl "
            onSearchKeyboard={handleSearch}
          />
          <AsyncMultiSelectTagDropdown
            placeholder={"search By Categories"}
            loadOptions={promiseOptions}
            onChange={(selectedVlaues) => {
              setCategories(selectedVlaues.map((item) => item.value))
            }}
          />
        </div>

        <div className="flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
          {isLoading || isFetching ? (
            [...Array(3)].map((item, index) => (
              <ArticleCardSkeleton
                key={index}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33% - 21px)]"
              />
            ))
          ) : isError ? (
            <ErrorMessage message="Could not fetch post data. Sorry for the inconvenience!" />
          ) : data?.data.length === 0 ? (
            <p className="text-red-700">No Posts Found:0</p>
          ) : (
            data?.data.map((post) => (
              <ArticleCard
                key={post._id}
                post={post}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33% - 21px)]"
              />
            ))
          )}
        </div>
        {!isLoading && (
          <Pagination
            onPageChange={(page) => handlePageChange(page)}
            currentPage={currentPage}
            totalPageCount={data?.headers?.["x-totalpagecount"] ? JSON.parse(data.headers["x-totalpagecount"]) : 1}

          />
        )}
      </section>
    </MainLayout>
  );
};

export default BlogPage;
