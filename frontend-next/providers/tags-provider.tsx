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
import tagsService from "@/services/tags.service";

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
        const response = await tagsService.getAll();

        if (!response.success) {
          showErrorToastWithTimeout("Something went wrong");

          return;
        }
        const data = response.data;

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
