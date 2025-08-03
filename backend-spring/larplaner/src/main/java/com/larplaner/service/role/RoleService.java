package com.larplaner.service.role;

import java.util.List;
import java.util.UUID;

import com.larplaner.dto.role.RoleRequestDTO;
import com.larplaner.dto.role.RoleDetailedResponseDTO;
import com.larplaner.dto.role.UpdateRoleRequestDTO;

public interface RoleService {

  List<RoleDetailedResponseDTO> getAllRoles();

  RoleDetailedResponseDTO getRoleById(UUID id);

  RoleDetailedResponseDTO createRole(RoleRequestDTO roleDTO);

  RoleDetailedResponseDTO updateRole(UUID id, UpdateRoleRequestDTO roleDTO);

  void deleteRole(UUID id);
}