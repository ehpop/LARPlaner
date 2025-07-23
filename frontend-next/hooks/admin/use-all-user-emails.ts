import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/providers/firebase-provider";
import usersService from "@/services/admin/users.service";

const useAllUserEmails = () => {
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!auth.isAdmin) {
      setEmails([]);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await usersService.getAllEmails();

      if (res.success) {
        setEmails(res.data);
      } else {
        setError(res.data || "Failed to fetch all user emails.");
      }
    } catch (err) {
      setError(err as string);
      setEmails([]);
    } finally {
      setIsLoading(false);
    }
  }, [auth.user]);

  useEffect(() => {
    fetchData().finally(() => {});
  }, [auth.user, fetchData]);

  return {
    emails,
    isLoading,
    error,
    refatch: fetchData,
  };
};

export default useAllUserEmails;
