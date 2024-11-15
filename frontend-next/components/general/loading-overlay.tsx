// components/LoadingOverlay.js
import React from "react";
import { Spinner } from "@nextui-org/react"; // Adjust this import based on your Spinner component

const LoadingOverlay = ({
  isLoading,
  label,
  children,
}: {
  isLoading: boolean;
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative w-full">
      <div
        className={`transition-all duration-300 ${isLoading ? "opacity-50 blur-sm" : ""}`}
      >
        {children}
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner label={label} size="lg" />
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
