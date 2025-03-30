import { showErrorToastWithTimeout } from "@/utils/toast";

export const showErrorMessage = (message: string | undefined) => {
  showErrorToastWithTimeout(
    message || "An error occurred while fetching game data.",
  );
};
