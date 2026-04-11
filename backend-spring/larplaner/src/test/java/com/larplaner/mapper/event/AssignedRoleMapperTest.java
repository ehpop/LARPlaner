package com.larplaner.mapper.event;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import com.larplaner.dto.event.assignedRole.AssignedRoleResponseDTO;
import com.larplaner.model.event.AssignedRole;
import com.larplaner.model.event.Event;
import com.larplaner.model.scenario.ScenarioRole;
import com.larplaner.repository.scenario.ScenarioRoleRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AssignedRoleMapperTest {

  @Mock
  private ScenarioRoleRepository scenarioRoleRepository;

  @InjectMocks
  private AssignedRoleMapper assignedRoleMapper;

  @Test
  @DisplayName("Should map AssignedRole to DTO with all fields")
  void givenAssignedRole_whenToDTO_thenMapsAllFields() {
    // given
    Event event = Event.builder().name("Event").build();
    ScenarioRole scenarioRole = ScenarioRole.builder().descriptionForGM("GM desc").build();
    AssignedRole assignedRole = AssignedRole.builder()
        .assignedEmail("player@example.com")
        .event(event)
        .scenarioRole(scenarioRole)
        .build();

    // when
    AssignedRoleResponseDTO result = assignedRoleMapper.toDTO(assignedRole);

    // then
    assertThat(result).isNotNull();
    assertThat(result.getId()).isEqualTo(assignedRole.getId());
    assertThat(result.getAssignedEmail()).isEqualTo("player@example.com");
    assertThat(result.getEventId()).isEqualTo(event.getId());
    assertThat(result.getScenarioRoleId()).isEqualTo(scenarioRole.getId());
  }

  @Test
  @DisplayName("Should handle null scenario role and event in toDTO")
  void givenAssignedRoleWithNulls_whenToDTO_thenHandlesGracefully() {
    // given
    AssignedRole assignedRole = AssignedRole.builder()
        .assignedEmail("player@example.com")
        .build();

    // when
    AssignedRoleResponseDTO result = assignedRoleMapper.toDTO(assignedRole);

    // then
    assertThat(result).isNotNull();
    assertThat(result.getAssignedEmail()).isEqualTo("player@example.com");
    assertThat(result.getScenarioRoleId()).isNull();
    assertThat(result.getEventId()).isNull();
  }
}
