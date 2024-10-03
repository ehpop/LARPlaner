import { useEffect, useState } from "react";

export const usePagination = <T extends any[]>(
  list: T,
  itemsPerPage: number,
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState<T[]>([]);

  const getAmountOfPages = (list: T) => Math.ceil(list.length / itemsPerPage);

  const getPages = (list: T) => {
    const pagesArray: T[] = [];
    const totalPages = getAmountOfPages(list);

    for (let i = 1; i <= totalPages; i++) {
      const page = list.slice((i - 1) * itemsPerPage, i * itemsPerPage);

      pagesArray.push(page as T);
    }

    return pagesArray;
  };

  useEffect(() => {
    setPages(getPages(list));
    setCurrentPage(1);
  }, [list, itemsPerPage]);

  return {
    currentPage,
    pages,
    totalPages: pages.length,
    setCurrentPage,
  };
};
