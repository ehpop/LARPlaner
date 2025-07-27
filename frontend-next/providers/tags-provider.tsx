"use client";

import React, { createContext, ReactNode, useContext } from "react";

import { ITagPersisted } from "@/types/tags.types";
import { useTags } from "@/services/tags/useTags";

interface ITagsContext {
  allTags: ITagPersisted[] | undefined;
  isLoading: boolean;
  refetchTags: () => void;
  isError: boolean;
  error: Error | null;
}

const TagsContext = createContext<ITagsContext | undefined>(undefined);

export const TagsProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: allTags,
    isLoading,
    isError,
    error,
    refetch: refetchTags,
  } = useTags();

  return (
    <TagsContext.Provider
      value={{ allTags, isLoading, isError, error, refetchTags }}
    >
      {children}
    </TagsContext.Provider>
  );
};

export const useTagsContext = (): ITagsContext => {
  const context = useContext(TagsContext);

  if (context === undefined) {
    throw new Error("useTags must be used within a TagsProvider");
  }

  return context;
};
