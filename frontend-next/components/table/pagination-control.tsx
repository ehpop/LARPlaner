import { Button } from "@nextui-org/button";
import { FormattedMessage } from "react-intl";

const PaginationControl = ({
  currentPage,
  totalPages,
  nextPage,
  previousPage,
}: {
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  previousPage: () => void;
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <Button
        color="default"
        isDisabled={currentPage === 1}
        onClick={previousPage}
      >
        <FormattedMessage defaultMessage="Previous" id="pagination.previous" />
      </Button>
      <p className="text-sm">
        <FormattedMessage
          defaultMessage="Page {currentPage} of {totalPages}"
          id="pagination.info"
          values={{ currentPage, totalPages }}
        />
      </p>
      <Button
        color="default"
        isDisabled={currentPage === totalPages}
        onPress={nextPage}
      >
        <FormattedMessage defaultMessage="Next" id="pagination.next" />
      </Button>
    </div>
  );
};

export default PaginationControl;
