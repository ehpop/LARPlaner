"use client";

import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";

export default function ToastContainerWrapper() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      closeOnClick
      draggable
      pauseOnFocusLoss
      pauseOnHover
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      position="bottom-right"
      rtl={false}
      theme={theme}
    />
  );
}
