import { Pagination } from "@heroui/react";

const PaginationControl = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}) => {
  return (
    <div className="w-full flex justify-center items-center mt-4">
      <Pagination
        loop
        showControls
        color="default"
        page={currentPage}
        total={totalPages}
        onChange={setCurrentPage}
      />
    </div>
  );
};

export default PaginationControl;
