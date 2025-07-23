package com.larplaner.api.role.controller;

import com.larplaner.api.role.RoleController;
import com.larplaner.dto.role.RoleRequestDTO;
import com.larplaner.dto.role.RoleResponseDTO;
import com.larplaner.dto.role.UpdateRoleRequestDTO;
import com.larplaner.service.admin.security.SecurityService;
import com.larplaner.service.role.RoleService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/roles")
public class RoleControllerImpl implements RoleController {

  private final RoleService roleService;

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<List<RoleResponseDTO>> getAllRoles() {
    return ResponseEntity.ok(roleService.getAllRoles());
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN') or @securityService.isUserAssignedToRole(#id)")
  public ResponseEntity<RoleResponseDTO> getRoleById(UUID id) {
    RoleResponseDTO role = roleService.getRoleById(id);
    return role != null
        ? ResponseEntity.ok(role)
        : ResponseEntity.notFound().build();
  }

  @Override
  public ResponseEntity<RoleResponseDTO> createRole(RoleRequestDTO roleDTO) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(roleService.createRole(roleDTO));
  }

  @Override
  public ResponseEntity<RoleResponseDTO> updateRole(UUID id, UpdateRoleRequestDTO roleDTO) {
    RoleResponseDTO updatedRole = roleService.updateRole(id, roleDTO);
    return updatedRole != null
        ? ResponseEntity.ok(updatedRole)
        : ResponseEntity.notFound().build();
  }

  @Override
  public ResponseEntity<Void> deleteRole(UUID id) {
    roleService.deleteRole(id);
    return ResponseEntity.noContent().build();
  }
}