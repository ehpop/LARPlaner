import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

import { IRole, IRoleList } from "@/types/roles.types";
import { possibleRoles } from "@/services/mock/mock-data";

const roles: IRoleList = possibleRoles;

export default function setupMock(api: AxiosInstance) {
  const mock = new MockAdapter(api, { delayResponse: 2000 });

  mock.onGet("/roles").reply(200, roles);

  // Mocking the GET /roles/:id endpoint
  mock.onGet(/\/roles\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() || "0", 10);
    const role = roles.find((r) => r.id === id);

    return role ? [200, role] : [404, { message: "Role not found" }];
  });

  // Mocking the POST /roles endpoint
  mock.onPost("/roles").reply((config) => {
    const newRole: IRole = JSON.parse(config.data);

    newRole.id = roles.length + 1;
    roles.push(newRole);

    return [201, newRole];
  });

  // Mocking the PUT /roles/:id endpoint
  mock.onPut(/\/roles\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() || "0", 10);
    const updatedRole: IRole = JSON.parse(config.data);
    const roleIndex = roles.findIndex((r) => r.id === id);

    if (roleIndex !== -1) {
      roles[roleIndex] = { ...roles[roleIndex], ...updatedRole };

      return [200, roles[roleIndex]];
    }

    return [404, { message: "Role not found" }];
  });

  // Mocking the DELETE /roles/:id endpoint
  mock.onDelete(/\/roles\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() || "0", 10);
    const roleIndex = roles.findIndex((r) => r.id === id);

    if (roleIndex !== -1) {
      const deletedRole = roles.splice(roleIndex, 1);

      return [200, deletedRole[0]];
    }

    return [404, { message: "Role not found" }];
  });
}
