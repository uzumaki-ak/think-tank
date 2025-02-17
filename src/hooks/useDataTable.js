import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

let isFirstRun = true;

export const useDataTable = ({
  dataQueryFn,
  dataQueryKey,
  mutateDeleteFn,
  deleteDataMessage,
}) => {
  const userState = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const [searchKeyboard, setSearchKeyboard] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryFn: dataQueryFn,
    queryKey: [dataQueryKey],
  });

  const { mutate: mutateDeletePost, isloading: isLoadingDeleteData } =
    useMutation({
      mutationFn: mutateDeleteFn,
      onSuccess: (data) => {
        queryClient.invalidateQueries([dataQueryKey]);
        toast.success(deleteDataMessage);
      },
      onError: (error) => {
        toast.error(error.message);

        console.log(error);
      },
    });

  useEffect(() => {
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    refetch();
  }, [refetch, currentPage]);

  const searchKeyboardHandler = (e) => {
    const { value } = e.target;
    setSearchKeyboard(value);
  };

  const submitSearchKeyboardHandler = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const deleteDataHandler = ({ slug, token }) => {
    if(window.confirm(" you sure? want to delete this record!")) {
      mutateDeletePost({ slug, token });
    }
  };

  return {
    userState,
    currentPage,
    searchKeyboard,
    data,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeyboardHandler,
    submitSearchKeyboardHandler,
    deleteDataHandler,
    setCurrentPage,
  };
};
