package com.larplaner.service.role;

import java.util.List;
import java.util.UUID;

import com.larplaner.dto.role.RoleRequestDTO;
import com.larplaner.dto.role.RoleResponseDTO;
import com.larplaner.dto.role.UpdateRoleRequestDTO;

public interface RoleService {

  List<RoleResponseDTO> getAllRoles();

  RoleResponseDTO getRoleById(UUID id);

  RoleResponseDTO createRole(RoleRequestDTO roleDTO);

  RoleResponseDTO updateRole(UUID id, UpdateRoleRequestDTO roleDTO);

  void deleteRole(UUID id);
}