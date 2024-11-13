import { IRole } from "@/types/roles.types";
import CrudService from "@/services/crud.service";

class RolesService extends CrudService<IRole> {
  constructor() {
    super("/roles");
  }
}

export default new RolesService();
