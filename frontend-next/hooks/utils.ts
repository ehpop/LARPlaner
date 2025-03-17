import { toast } from "react-toastify";

export const showErrorMessage = (message: string | undefined) => {
  toast(message || "An error occurred while fetching game data.", {
    type: "error",
  });
};
