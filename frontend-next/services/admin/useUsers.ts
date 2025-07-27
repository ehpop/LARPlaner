import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { api } from "@/services/axios";
import { MINUTE } from "@/utils/date-time";

const usersQueryKeys = {
  all: ["users"] as const,
  emails: () => [...usersQueryKeys.all, "emails"] as const,
};

const getAllEmails = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>("/admin/users/emails");

  return data;
};

export const useAllUserEmails = (): UseQueryResult<string[], Error> => {
  return useQuery({
    queryKey: usersQueryKeys.emails(),
    queryFn: getAllEmails,
    staleTime: 5 * MINUTE,
  });
};
