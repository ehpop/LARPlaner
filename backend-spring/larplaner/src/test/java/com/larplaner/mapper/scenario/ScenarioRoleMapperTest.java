package com.larplaner.mapper.scenario;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import com.larplaner.dto.role.RoleSummaryResponseDTO;
import com.larplaner.dto.scenario.role.ScenarioRoleDetailedResponseDTO;
import com.larplaner.dto.scenario.role.ScenarioRoleRequestDTO;
import com.larplaner.dto.scenario.role.ScenarioRoleResponseDTO;
import com.larplaner.dto.scenario.role.UpdateScenarioRoleRequestDTO;
import com.larplaner.mapper.role.RoleMapper;
import com.larplaner.model.role.Role;
import com.larplaner.model.scenario.Scenario;
import com.larplaner.model.scenario.ScenarioRole;
import com.larplaner.repository.role.RoleRepository;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ScenarioRoleMapperTest {

  @Mock
  private RoleRepository roleRepository;
  @Mock
  private RoleMapper roleMapper;

  @InjectMocks
  private ScenarioRoleMapper scenarioRoleMapper;

  private ScenarioRole sampleScenarioRole;
  private Role sampleRole;
  private Scenario sampleScenario;

  @BeforeEach
  void setUp() {
    sampleRole = Role.builder().name("Warrior").description("A warrior role").build();
    sampleScenario = Scenario.builder().name("Test Scenario").build();
    sampleScenarioRole = ScenarioRole.builder()
        .role(sampleRole)
        .scenario(sampleScenario)
        .descriptionForGM("GM sees this")
        .descriptionForOwner("Owner sees this")
        .descriptionForOthers("Others see this")
        .build();
  }

  @Nested
  @DisplayName("toDTO")
  class ToDTO {

    @Test
    @DisplayName("Should map ScenarioRole to summary DTO")
    void givenValidEntity_whenToDTO_thenMapsAllFields() {
      // when
      ScenarioRoleResponseDTO result = scenarioRoleMapper.toDTO(sampleScenarioRole);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(sampleScenarioRole.getId());
      assertThat(result.getRoleId()).isEqualTo(sampleRole.getId());
      assertThat(result.getScenarioId()).isEqualTo(sampleScenario.getId());
      assertThat(result.getDescriptionForGM()).isEqualTo("GM sees this");
      assertThat(result.getDescriptionForOwner()).isEqualTo("Owner sees this");
      assertThat(result.getDescriptionForOthers()).isEqualTo("Others see this");
    }

    @Test
    @DisplayName("Should return null when input is null")
    void givenNull_whenToDTO_thenReturnsNull() {
      assertThat(scenarioRoleMapper.toDTO(null)).isNull();
    }
  }

  @Nested
  @DisplayName("toDetailedDTO")
  class ToDetailedDTO {

    @Test
    @DisplayName("Should delegate role mapping to RoleMapper")
    void givenValidEntity_whenToDetailedDTO_thenDelegatesRoleMapping() {
      // given
      RoleSummaryResponseDTO roleDTO = RoleSummaryResponseDTO.builder()
          .id(sampleRole.getId())
          .name("Warrior")
          .build();
      given(roleMapper.toDTO(sampleRole)).willReturn(roleDTO);

      // when
      ScenarioRoleDetailedResponseDTO result = scenarioRoleMapper.toDetailedDTO(sampleScenarioRole);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getRole()).isNotNull();
      assertThat(result.getRole().getName()).isEqualTo("Warrior");
      assertThat(result.getDescriptionForGM()).isEqualTo("GM sees this");
    }
  }

  @Nested
  @DisplayName("toEntity")
  class ToEntity {

    @Test
    @DisplayName("Should map DTO to entity with role from repository")
    void givenValidDTO_whenToEntity_thenMapsCorrectly() {
      // given
      UUID roleId = sampleRole.getId();
      ScenarioRoleRequestDTO dto = ScenarioRoleRequestDTO.builder()
          .roleId(roleId)
          .descriptionForGM("New GM desc")
          .descriptionForOwner("New Owner desc")
          .descriptionForOthers("New Others desc")
          .build();

      given(roleRepository.getReferenceById(roleId)).willReturn(sampleRole);

      // when
      ScenarioRole result = scenarioRoleMapper.toEntity(dto);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getRole()).isEqualTo(sampleRole);
      assertThat(result.getDescriptionForGM()).isEqualTo("New GM desc");
    }
  }

  @Nested
  @DisplayName("updateEntityFromDTO")
  class UpdateEntityFromDTO {

    @Test
    @DisplayName("Should update only non-null fields")
    void givenPartialUpdate_whenUpdate_thenUpdatesOnlyProvidedFields() {
      // given
      UpdateScenarioRoleRequestDTO dto = UpdateScenarioRoleRequestDTO.builder()
          .descriptionForGM("Updated GM")
          .descriptionForOwner(null)
          .descriptionForOthers(null)
          .build();

      // when
      scenarioRoleMapper.updateEntityFromDTO(dto, sampleScenarioRole);

      // then
      assertThat(sampleScenarioRole.getDescriptionForGM()).isEqualTo("Updated GM");
      assertThat(sampleScenarioRole.getDescriptionForOwner()).isEqualTo("Owner sees this");
      assertThat(sampleScenarioRole.getDescriptionForOthers()).isEqualTo("Others see this");
    }
  }
}
