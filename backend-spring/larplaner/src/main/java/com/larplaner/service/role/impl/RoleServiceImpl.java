package com.larplaner.service.role.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.larplaner.dto.role.RoleRequestDTO;
import com.larplaner.dto.role.RoleResponseDTO;
import com.larplaner.dto.role.UpdateRoleRequestDTO;
import com.larplaner.exception.EntityCouldNotBeDeleted;
import com.larplaner.mapper.role.RoleMapper;
import com.larplaner.model.role.Role;
import com.larplaner.model.tag.Tag;
import com.larplaner.repository.role.RoleRepository;
import com.larplaner.repository.scenario.ScenarioRoleRepository;
import com.larplaner.service.role.RoleService;
import com.larplaner.service.tag.helper.TagHelper;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

  private final RoleRepository roleRepository;
  private final RoleMapper roleMapper;
  private final TagHelper roleTagHelper;
  private final ScenarioRoleRepository scenarioRoleRepository;

  @Override
  public List<RoleResponseDTO> getAllRoles() {
    return roleRepository.findAll().stream()
        .map(roleMapper::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public RoleResponseDTO getRoleById(UUID id) {
    Role role = roleRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Role not found with id: " + id));
    return roleMapper.toDTO(role);
  }

  @Override
  @Transactional
  public RoleResponseDTO createRole(RoleRequestDTO roleDTO) {
    Role role = roleMapper.toEntity(roleDTO);

    List<Tag> tagsToAssociate = roleTagHelper.processTags(roleDTO.getTags());
    role.setTags(tagsToAssociate);

    return roleMapper.toDTO(roleRepository.save(role));
  }

  @Override
  @Transactional
  public RoleResponseDTO updateRole(UUID id, UpdateRoleRequestDTO roleDTO) {
    Role existingRole = roleRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Role not found with id: " + id));

    roleMapper.updateEntityFromDTO(roleDTO, existingRole);

    List<Tag> tagsToAssociate = roleTagHelper.processTags(roleDTO.getTags());
    existingRole.setTags(tagsToAssociate);

    return roleMapper.toDTO(roleRepository.save(existingRole));
  }

  @Override
  public void deleteRole(UUID id) {
    if (!roleRepository.existsById(id)) {
      throw new EntityNotFoundException("Role not found with id: " + id);
    }

    try {
      roleRepository.deleteById(id);
    } catch (DataIntegrityViolationException e) {
      var scenarioRole = scenarioRoleRepository.findByRoleId(id)
          .orElseThrow(EntityNotFoundException::new);
      throw new EntityCouldNotBeDeleted(
          "Role could not be deleted, because it is referenced in scenario: "
              + scenarioRole.getScenario().getId());
    }
  }
}