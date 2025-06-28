"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { ITag } from "@/types/tags.types";
import { showErrorToastWithTimeout } from "@/utils/toast";

interface ITagsContext {
  allTags: ITag[];
  isLoading: boolean;
  refetchTags: () => void;
}

// Create the context with a default value
const TagsContext = createContext<ITagsContext | undefined>(undefined);

// Create the Provider component
export const TagsProvider = ({ children }: { children: ReactNode }) => {
  const [allTags, setAllTags] = useState<ITag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetchTags = () => setRefetchTrigger((prev) => prev + 1);

  useEffect(() => {
    const fetchAllTags = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/tags");

        if (!response.ok) {
          showErrorToastWithTimeout("Something went wrong");
        }
        const data: ITag[] = await response.json();

        setAllTags(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTags();
  }, [refetchTrigger]);

  return (
    <TagsContext.Provider value={{ allTags, isLoading, refetchTags }}>
      {children}
    </TagsContext.Provider>
  );
};

// Create a custom hook for easy consumption
export const useTags = (): ITagsContext => {
  const context = useContext(TagsContext);

  if (context === undefined) {
    throw new Error("useTags must be used within a TagsProvider");
  }

  return context;
};
