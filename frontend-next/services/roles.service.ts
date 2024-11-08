import { Response } from "@/types/axios.types";
import { IRole, IRoleList } from "@/types/roles.types";
import { api } from "@/services/axios";

class RolesService {
  async getAllRoles(): Promise<Response<IRoleList>> {
    return api
      .get("/roles")
      .then((result) => ({
        success: true,
        data: result.data,
      }))
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }

  async getRoleById(id: number): Promise<Response<IRole>> {
    return api
      .get(`/roles/${id}`)
      .then((result) => ({
        success: true,
        data: result.data,
      }))
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }

  async saveRole(role: IRole): Promise<Response<IRole>> {
    return api
      .post(`/roles`, JSON.stringify(role))
      .then((result) => ({
        success: true,
        data: result.data,
      }))
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }

  async editRole(id: number, role: IRole): Promise<Response<IRole>> {
    return api
      .put(`/roles/${id}`, JSON.stringify(role))
      .then((result) => ({
        success: true,
        data: result.data,
      }))
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }

  async deleteRole(id: number): Promise<Response<IRole>> {
    return api
      .delete(`/roles/${id}`)
      .then((result) => ({
        success: true,
        data: result.data,
      }))
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }
}

export default new RolesService();
