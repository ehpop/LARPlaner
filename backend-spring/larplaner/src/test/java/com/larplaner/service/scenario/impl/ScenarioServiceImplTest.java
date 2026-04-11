package com.larplaner.service.scenario.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.larplaner.dto.scenario.ScenarioDetailedResponseDTO;
import com.larplaner.dto.scenario.ScenarioRequestDTO;
import com.larplaner.dto.scenario.ScenarioResponseDTO;
import com.larplaner.exception.EntityCouldNotBeDeleted;
import com.larplaner.mapper.scenario.ScenarioActionMapper;
import com.larplaner.mapper.scenario.ScenarioItemActionMapper;
import com.larplaner.mapper.scenario.ScenarioItemMapper;
import com.larplaner.mapper.scenario.ScenarioMapper;
import com.larplaner.mapper.scenario.ScenarioRoleMapper;
import com.larplaner.model.scenario.Scenario;
import com.larplaner.repository.event.EventRepository;
import com.larplaner.repository.scenario.ScenarioActionRepository;
import com.larplaner.repository.scenario.ScenarioItemActionRepository;
import com.larplaner.repository.scenario.ScenarioItemRepository;
import com.larplaner.repository.scenario.ScenarioRepository;
import com.larplaner.repository.scenario.ScenarioRoleRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

@ExtendWith(MockitoExtension.class)
class ScenarioServiceImplTest {

  @Mock
  private ScenarioRepository scenarioRepository;
  @Mock
  private ScenarioMapper scenarioMapper;
  @Mock
  private ScenarioRoleMapper scenarioRoleMapper;
  @Mock
  private ScenarioActionMapper scenarioActionMapper;
  @Mock
  private ScenarioItemMapper scenarioItemMapper;
  @Mock
  private ScenarioItemActionMapper scenarioItemActionMapper;
  @Mock
  private ScenarioRoleRepository scenarioRoleRepository;
  @Mock
  private ScenarioItemRepository scenarioItemRepository;
  @Mock
  private ScenarioActionRepository scenarioActionRepository;
  @Mock
  private ScenarioItemActionRepository scenarioItemActionRepository;
  @Mock
  private EventRepository eventRepository;

  @InjectMocks
  private ScenarioServiceImpl scenarioService;

  private Scenario sampleScenario;
  private ScenarioResponseDTO sampleScenarioDTO;
  private UUID sampleScenarioId;

  @BeforeEach
  void setUp() {
    sampleScenario = Scenario.builder()
        .name("Test Scenario")
        .description("A test LARP scenario")
        .roles(new ArrayList<>())
        .items(new ArrayList<>())
        .actions(new ArrayList<>())
        .build();

    sampleScenarioId = sampleScenario.getId();

    sampleScenarioDTO = ScenarioResponseDTO.builder()
        .id(sampleScenarioId)
        .name(sampleScenario.getName())
        .description(sampleScenario.getDescription())
        .build();
  }

  @Nested
  @DisplayName("getAllScenarios")
  class GetAllScenarios {

    @Test
    @DisplayName("Should return list of scenario DTOs")
    void givenScenariosExist_whenGetAllScenarios_thenReturnsListOfDTOs() {
      // given
      given(scenarioRepository.findAll()).willReturn(List.of(sampleScenario));
      given(scenarioMapper.toDTO(sampleScenario)).willReturn(sampleScenarioDTO);

      // when
      List<ScenarioResponseDTO> result = scenarioService.getAllScenarios();

      // then
      assertThat(result).isNotNull().hasSize(1);
      assertThat(result.get(0).getName()).isEqualTo("Test Scenario");
      verify(scenarioRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return empty list when no scenarios exist")
    void givenNoScenarios_whenGetAllScenarios_thenReturnsEmptyList() {
      // given
      given(scenarioRepository.findAll()).willReturn(Collections.emptyList());

      // when
      List<ScenarioResponseDTO> result = scenarioService.getAllScenarios();

      // then
      assertThat(result).isNotNull().isEmpty();
    }
  }

  @Nested
  @DisplayName("getScenarioById")
  class GetScenarioById {

    @Test
    @DisplayName("Should return scenario DTO when scenario exists")
    void givenExistingId_whenGetScenarioById_thenReturnsScenarioDTO() {
      // given
      given(scenarioRepository.findById(sampleScenarioId))
          .willReturn(Optional.of(sampleScenario));
      given(scenarioMapper.toDTO(sampleScenario)).willReturn(sampleScenarioDTO);

      // when
      ScenarioResponseDTO result = scenarioService.getScenarioById(sampleScenarioId);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(sampleScenarioId);
      assertThat(result.getName()).isEqualTo("Test Scenario");
    }

    @Test
    @DisplayName("Should throw EntityNotFoundException when scenario does not exist")
    void givenNonExistentId_whenGetScenarioById_thenThrowsEntityNotFoundException() {
      // given
      UUID nonExistentId = UUID.randomUUID();
      given(scenarioRepository.findById(nonExistentId)).willReturn(Optional.empty());

      // when & then
      assertThatThrownBy(() -> scenarioService.getScenarioById(nonExistentId))
          .isInstanceOf(EntityNotFoundException.class)
          .hasMessageContaining("Scenario not found with id: " + nonExistentId);
    }
  }

  @Nested
  @DisplayName("getDetailedScenarioById")
  class GetDetailedScenarioById {

    @Test
    @DisplayName("Should return detailed scenario DTO when scenario exists")
    void givenExistingId_whenGetDetailedScenarioById_thenReturnsDetailedDTO() {
      // given
      ScenarioDetailedResponseDTO detailedDTO = ScenarioDetailedResponseDTO.builder()
          .id(sampleScenarioId)
          .name(sampleScenario.getName())
          .description(sampleScenario.getDescription())
          .build();

      given(scenarioRepository.findById(sampleScenarioId))
          .willReturn(Optional.of(sampleScenario));
      given(scenarioMapper.toDetailedDTO(sampleScenario)).willReturn(detailedDTO);

      // when
      ScenarioDetailedResponseDTO result =
          scenarioService.getDetailedScenarioById(sampleScenarioId);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(sampleScenarioId);
      assertThat(result.getName()).isEqualTo("Test Scenario");
    }

    @Test
    @DisplayName("Should throw EntityNotFoundException when scenario does not exist")
    void givenNonExistentId_whenGetDetailedScenarioById_thenThrowsException() {
      // given
      UUID nonExistentId = UUID.randomUUID();
      given(scenarioRepository.findById(nonExistentId)).willReturn(Optional.empty());

      // when & then
      assertThatThrownBy(() -> scenarioService.getDetailedScenarioById(nonExistentId))
          .isInstanceOf(EntityNotFoundException.class)
          .hasMessageContaining("Scenario not found with id: " + nonExistentId);
    }
  }

  @Nested
  @DisplayName("createScenario")
  class CreateScenario {

    @Test
    @DisplayName("Should save and return scenario DTO")
    void givenValidRequest_whenCreateScenario_thenSavesAndReturnsDTO() {
      // given
      ScenarioRequestDTO requestDTO = ScenarioRequestDTO.builder()
          .name("New Scenario")
          .description("New scenario description")
          .roles(Collections.emptyList())
          .items(Collections.emptyList())
          .actions(Collections.emptyList())
          .build();

      given(scenarioMapper.toEntity(requestDTO)).willReturn(sampleScenario);
      given(scenarioRepository.save(sampleScenario)).willReturn(sampleScenario);
      given(scenarioMapper.toDTO(sampleScenario)).willReturn(sampleScenarioDTO);

      // when
      ScenarioResponseDTO result = scenarioService.createScenario(requestDTO);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getName()).isEqualTo("Test Scenario");
      verify(scenarioRepository, times(1)).save(sampleScenario);
    }
  }

  @Nested
  @DisplayName("deleteScenario")
  class DeleteScenario {

    @Test
    @DisplayName("Should call repository deleteById when scenario exists")
    void givenExistingId_whenDeleteScenario_thenCallsRepositoryDelete() {
      // given
      given(scenarioRepository.existsById(sampleScenarioId)).willReturn(true);
      willDoNothing().given(scenarioRepository).deleteById(sampleScenarioId);

      // when
      scenarioService.deleteScenario(sampleScenarioId);

      // then
      verify(scenarioRepository, times(1)).deleteById(sampleScenarioId);
    }

    @Test
    @DisplayName("Should throw EntityNotFoundException when scenario does not exist")
    void givenNonExistentId_whenDeleteScenario_thenThrowsEntityNotFoundException() {
      // given
      UUID nonExistentId = UUID.randomUUID();
      given(scenarioRepository.existsById(nonExistentId)).willReturn(false);

      // when & then
      assertThatThrownBy(() -> scenarioService.deleteScenario(nonExistentId))
          .isInstanceOf(EntityNotFoundException.class)
          .hasMessageContaining("Scenario not found with id: " + nonExistentId);
      verify(scenarioRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("Should throw EntityCouldNotBeDeleted when data integrity violation occurs")
    void givenForeignKeyConstraint_whenDeleteScenario_thenThrowsEntityCouldNotBeDeleted() {
      // given
      given(scenarioRepository.existsById(sampleScenarioId)).willReturn(true);
      willThrow(new DataIntegrityViolationException("FK constraint"))
          .given(scenarioRepository).deleteById(sampleScenarioId);

      // when & then
      assertThatThrownBy(() -> scenarioService.deleteScenario(sampleScenarioId))
          .isInstanceOf(EntityCouldNotBeDeleted.class)
          .hasMessageContaining("could not be deleted because it is still referenced");
    }
  }
}
