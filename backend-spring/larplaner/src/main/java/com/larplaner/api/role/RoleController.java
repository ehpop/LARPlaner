package com.larplaner.api.role;

import com.larplaner.dto.role.RoleRequestDTO;
import com.larplaner.dto.role.RoleDetailedResponseDTO;
import com.larplaner.dto.role.UpdateRoleRequestDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Role", description = "Role management APIs")
@SecurityRequirement(name = "bearer-key")
public interface RoleController {

  @Operation(summary = "Get all roles")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved all roles")
  })
  @GetMapping
  ResponseEntity<List<RoleDetailedResponseDTO>> getAllRoles();

  @Operation(summary = "Get role by ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved role"),
      @ApiResponse(responseCode = "404", description = "Role not found")
  })
  @GetMapping("/{id}")
  ResponseEntity<RoleDetailedResponseDTO> getRoleById(
      @Parameter(description = "ID of the role to retrieve") @PathVariable UUID id);

  @Operation(summary = "Create a new role")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "Role created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid input")
  })
  @PostMapping
  ResponseEntity<RoleDetailedResponseDTO> createRole(
      @Parameter(description = "Role to create") @Valid @RequestBody RoleRequestDTO roleDTO);

  @Operation(summary = "Update an existing role")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Role updated successfully"),
      @ApiResponse(responseCode = "404", description = "Role not found"),
      @ApiResponse(responseCode = "400", description = "Invalid input")
  })
  @PutMapping("/{id}")
  ResponseEntity<RoleDetailedResponseDTO> updateRole(
      @Parameter(description = "ID of the role to update") @PathVariable UUID id,
      @Parameter(description = "Updated role data") @Valid @RequestBody UpdateRoleRequestDTO roleDTO);

  @Operation(summary = "Delete a role")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "Role deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Role not found")
  })
  @DeleteMapping("/{id}")
  ResponseEntity<Void> deleteRole(
      @Parameter(description = "ID of the role to delete") @PathVariable UUID id);
}