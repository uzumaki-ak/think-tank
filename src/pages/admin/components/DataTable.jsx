import React from "react";
import Pagination from "../../../components/Pagination";

const DataTable = ({
  pageTitle,
  dalaListName,
  searchKeyboardOnSubmitHandler,
  searchInputPlaceholder,
  searchkeyboardOnChangeHandler,
  searchKeyboard,
  tableHeaderTitleList,
  isLoading,
  isFetching,
  data,
  children,
  setCurrentPage,
  currentPage,
  headers,
}) => {
  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-12">
        <span className="font-geist text-[10px] tracking-[0.4em] uppercase opacity-40 mb-2 block">System / Ledger</span>
        <h1 className="font-syne font-extrabold text-3xl uppercase tracking-tighter">{pageTitle}</h1>
      </div>
      
      <div className="w-full">
        <div className="py-4">
          <div className="flex flex-col md:flex-row justify-between items-end w-full mb-12 gap-8">
            <h2 className="font-syne font-bold text-xl uppercase tracking-tight opacity-80">{dalaListName}</h2>
            
            <form
              onSubmit={searchKeyboardOnSubmitHandler}
              className="flex w-full md:w-auto gap-0 border-thin border-black/10 dark:border-white/10"
            >
              <input
                type="text"
                className="bg-transparent font-ibm text-xs uppercase tracking-widest px-6 py-4 w-full md:w-64 outline-none placeholder:opacity-20"
                placeholder={searchInputPlaceholder || "SEARCH ARCHIVE..."}
                onChange={searchkeyboardOnChangeHandler}
                value={searchKeyboard}
              />
              <button
                className="px-8 py-4 bg-matte-black text-bone dark:bg-bone dark:text-matte-black font-bricolage text-[10px] uppercase tracking-[0.2em] hover:opacity-80 transition-opacity"
                type="submit"
              >
                FILTER
              </button>
            </form>
          </div>

          <div className="overflow-x-auto border-thin border-black/10 dark:border-white/10">
            <table className="min-w-full divide-y-thin divide-black/10 dark:divide-white/10">
              <thead className="bg-black/5 dark:bg-white/5">
                <tr>
                  {tableHeaderTitleList.map((title, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-8 py-6 text-[10px] font-geist tracking-[0.3em] text-left uppercase opacity-40"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-thin divide-black/10 dark:divide-white/10 bg-transparent">
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={tableHeaderTitleList.length} className="px-8 py-20 text-center font-ibm text-xs opacity-40">
                      SYNCHRONIZING DATA...
                    </td>
                  </tr>
                ) : data?.length === 0 ? (
                  <tr>
                    <td colSpan={tableHeaderTitleList.length} className="px-8 py-20 text-center font-ibm text-xs opacity-40">
                      NO RECORDS DETECTED IN ARCHIVE.
                    </td>
                  </tr>
                ) : (
                  children
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-12">
            {!isLoading && headers && (
              <Pagination
                onPageChange={(page) => setCurrentPage(page)}
                currentPage={currentPage}
                totalPageCount={headers?.["x-totalpagecount"] ? JSON.parse(headers["x-totalpagecount"]) : 0}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;

