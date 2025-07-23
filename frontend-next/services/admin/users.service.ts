import { Response } from "@/types/axios.types";
import { api } from "@/services/axios";

class UsersService {
  protected baseUrl = "/admin/users";

  async getAllEmails(): Promise<Response<string[]>> {
    return api
      .get(`${this.baseUrl}/emails`)
      .then((result) => {
        return {
          success: true,
          data: result.data,
        };
      })
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }
}

export default new UsersService();
