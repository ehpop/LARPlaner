import { useEffect, useState } from "react";

import { showErrorMessage } from "@/hooks/utils";
import { IRole } from "@/types/roles.types";
import rolesService from "@/services/roles.service";

const useRole = (id: string) => {
  const [role, setRole] = useState<IRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoleData = async () => {
      const roleResponse = await rolesService.getById(id);

      if (!roleResponse.success) {
        return showErrorMessage(roleResponse.data);
      }
      setRole(roleResponse.data);
    };

    loadRoleData().finally(() => setLoading(false));

    return () => {
      setLoading(true);
    };
  }, [id]);

  return { role, loading };
};

export default useRole;
