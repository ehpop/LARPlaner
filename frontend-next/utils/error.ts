import { isAxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  console.log("error: ", error);
  if (
    isAxiosError(error) &&
    error.response?.data?.message &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "An unknown error occurred.";
};
