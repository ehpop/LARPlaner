import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { UserInfo } from "@firebase/auth";

import { api } from "@/services/axios";
import { MINUTE } from "@/utils/date-time";

const usersQueryKeys = {
  all: ["users"] as const,
  emails: () => [...usersQueryKeys.all, "emails"] as const,
  user: (userId: UserInfo["uid"]) =>
    [...usersQueryKeys.all, "user", userId] as const,
};

const getAllEmails = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>("/admin/users/emails");

  return data;
};

const getUserInfo = async (id: UserInfo["uid"]): Promise<UserInfo> => {
  const { data } = await api.get(`/admin/users/${id}`);

  return { ...data, photoURL: data.photoUrl }; //I know weird, but it's different in UserRecord and UserInfo type
};

export const useAllUserEmails = (): UseQueryResult<string[], Error> => {
  return useQuery({
    queryKey: usersQueryKeys.emails(),
    queryFn: getAllEmails,
    staleTime: 5 * MINUTE,
  });
};

export const useUserInfo = (
  id: UserInfo["uid"] | undefined,
): UseQueryResult<UserInfo, Error> => {
  return useQuery({
    enabled: !!id,
    queryKey: usersQueryKeys.user(id as UserInfo["uid"]),
    queryFn: () => getUserInfo(id as UserInfo["uid"]),
    staleTime: 5 * MINUTE,
  });
};
