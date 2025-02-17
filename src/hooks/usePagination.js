import { useMemo } from "react";

export const DOTS = "...";

export const usePagination = ({
  siblingCount = 1,
  currentPage,
  totalPageCount,
}) => {
  const paginationRange = useMemo(() => {
    //core logic here for pagination

    const totalPageNumbers = siblingCount + 5;

    //case 1 for the state 1 if numvber of pages is less than the opage numbers
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    //calculating the left and right indxe
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    //cal left dots or rigjht dots or both of thm
    //no dots when there is just 1 page numver to be inserted betwwin sibling and page linit
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    //state 2 of pagintion no left but right dot to ne shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageNumbers];
    }

    //state 3 logic no rigth dots to sho bu left dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rigthItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rigthItemCount + 1,
        totalPageCount
      );

      return [firstPageIndex, DOTS, ...rightRange];
    }

    //state 4 both left and right dots to be shown
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, middleRange, DOTS, lastPageIndex];
    }
  }, [siblingCount, currentPage, totalPageCount]);
  return paginationRange;
};

function range(start, end) {
  const length = end - start + 1;
  return Array.from({ length }, (value, index) => index + start);
}
