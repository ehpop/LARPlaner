import { useEffect, useState } from "react";

import { showErrorMessage } from "@/hooks/utils";
import { IRole } from "@/types/roles.types";
import rolesService from "@/services/roles.service";

const useAllRoles = () => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoleData = async () => {
      const roleResponse = await rolesService.getAll();

      if (!roleResponse.success) {
        return showErrorMessage(roleResponse.data);
      }
      setRoles(roleResponse.data);
    };

    loadRoleData().finally(() => setLoading(false));

    return () => {
      setLoading(true);
    };
  }, []);

  return { roles, loading };
};

export default useAllRoles;
