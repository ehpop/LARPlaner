import { IRole, IRoleGetDTO, IRolePostDTO } from "@/types/roles.types";
import CrudService from "@/services/crud.service";
import {
  convertGetDtoToRole,
  convertRoleToPostDto,
} from "@/services/converter/roles-converter";

class RolesService extends CrudService<IRole, IRoleGetDTO, IRolePostDTO> {
  constructor() {
    super("/roles", convertGetDtoToRole, convertRoleToPostDto);
  }
}

export default new RolesService();
