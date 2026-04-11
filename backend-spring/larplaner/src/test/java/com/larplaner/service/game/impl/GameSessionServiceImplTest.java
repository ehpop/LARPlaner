package com.larplaner.service.game.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.larplaner.dto.game.GameSessionDetailedResponseDTO;
import com.larplaner.dto.game.actionLog.GameActionLogDetailedResponseDTO;
import com.larplaner.dto.game.actionLog.GameActionLogSummaryResponseDTO;
import com.larplaner.mapper.game.GameSessionMapper;
import com.larplaner.mapper.game.action.GameActionLogMapper;
import com.larplaner.mapper.game.role.GameRoleStateMapper;
import com.larplaner.mapper.scenario.ScenarioActionMapper;
import com.larplaner.mapper.scenario.ScenarioItemActionMapper;
import com.larplaner.model.event.AssignedRole;
import com.larplaner.model.event.Event;
import com.larplaner.model.event.EventStatusEnum;
import com.larplaner.model.game.GameActionLog;
import com.larplaner.model.game.GameSession;
import com.larplaner.model.scenario.Scenario;
import com.larplaner.model.scenario.ScenarioItem;
import com.larplaner.repository.game.GameActionLogRepository;
import com.larplaner.repository.game.GameItemStateRepository;
import com.larplaner.repository.game.GameRoleStateRepository;
import com.larplaner.repository.game.GameSessionRepository;
import com.larplaner.repository.scenario.ScenarioActionRepository;
import com.larplaner.repository.scenario.ScenarioItemActionRepository;
import com.larplaner.service.admin.firebase.UserLookupService;
import com.larplaner.service.tag.helper.TagHelper;
import java.time.ZonedDateTime;
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

@ExtendWith(MockitoExtension.class)
class GameSessionServiceImplTest {

  @Mock
  private GameSessionRepository gameSessionRepository;
  @Mock
  private GameActionLogRepository gameActionLogRepository;
  @Mock
  private GameSessionMapper gameSessionMapper;
  @Mock
  private GameActionLogMapper gameActionLogMapper;
  @Mock
  private UserLookupService userLookupService;
  @Mock
  private ScenarioActionRepository scenarioActionRepository;
  @Mock
  private ScenarioItemActionRepository scenarioItemActionRepository;
  @Mock
  private GameRoleStateRepository gameRoleStateRepository;
  @Mock
  private TagHelper tagHelper;
  @Mock
  private ScenarioActionMapper scenarioActionMapper;
  @Mock
  private ScenarioItemActionMapper scenarioItemActionMapper;
  @Mock
  private GameItemStateRepository gameItemStateRepository;
  @Mock
  private GameRoleStateMapper gameRoleStateMapper;

  @InjectMocks
  private GameSessionServiceImpl gameSessionService;

  private GameSession sampleGameSession;
  private GameSessionDetailedResponseDTO sampleGameSessionDTO;
  private UUID sampleGameSessionId;

  @BeforeEach
  void setUp() {
    sampleGameSession = GameSession.builder()
        .startTime(ZonedDateTime.now())
        .assignedRoles(new ArrayList<>())
        .items(new ArrayList<>())
        .actions(new ArrayList<>())
        .build();

    sampleGameSessionId = sampleGameSession.getId();

    sampleGameSessionDTO = GameSessionDetailedResponseDTO.builder()
        .id(sampleGameSessionId)
        .startTime(sampleGameSession.getStartTime())
        .assignedRoles(new ArrayList<>())
        .items(new ArrayList<>())
        .build();
  }

  @Nested
  @DisplayName("getAllGameSessions")
  class GetAllGameSessions {

    @Test
    @DisplayName("Should return list of game session DTOs")
    void givenGameSessionsExist_whenGetAll_thenReturnsListOfDTOs() {
      // given
      given(gameSessionRepository.findAll()).willReturn(List.of(sampleGameSession));
      given(gameSessionMapper.toDetailedDTO(sampleGameSession)).willReturn(sampleGameSessionDTO);

      // when
      List<GameSessionDetailedResponseDTO> result = gameSessionService.getAllGameSessions();

      // then
      assertThat(result).isNotNull().hasSize(1);
      assertThat(result.get(0).getId()).isEqualTo(sampleGameSessionId);
      verify(gameSessionRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return empty list when no game sessions exist")
    void givenNoGameSessions_whenGetAll_thenReturnsEmptyList() {
      // given
      given(gameSessionRepository.findAll()).willReturn(Collections.emptyList());

      // when
      List<GameSessionDetailedResponseDTO> result = gameSessionService.getAllGameSessions();

      // then
      assertThat(result).isNotNull().isEmpty();
    }
  }

  @Nested
  @DisplayName("getGameSessionById")
  class GetGameSessionById {

    @Test
    @DisplayName("Should return game session DTO when it exists")
    void givenExistingId_whenGetById_thenReturnsDTO() {
      // given
      given(gameSessionRepository.findById(sampleGameSessionId))
          .willReturn(Optional.of(sampleGameSession));
      given(gameSessionMapper.toDetailedDTO(sampleGameSession)).willReturn(sampleGameSessionDTO);

      // when
      GameSessionDetailedResponseDTO result =
          gameSessionService.getGameSessionById(sampleGameSessionId);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(sampleGameSessionId);
    }

    @Test
    @DisplayName("Should return null when game session does not exist")
    void givenNonExistentId_whenGetById_thenReturnsNull() {
      // given
      UUID nonExistentId = UUID.randomUUID();
      given(gameSessionRepository.findById(nonExistentId)).willReturn(Optional.empty());

      // when
      GameSessionDetailedResponseDTO result = gameSessionService.getGameSessionById(nonExistentId);

      // then
      assertThat(result).isNull();
    }
  }

  @Nested
  @DisplayName("createGameSession")
  class CreateGameSession {

    @Test
    @DisplayName("Should build and save game session from event with scenario items")
    void givenEventWithScenarioItems_whenCreate_thenBuildsAndSavesGameSession() {
      // given
      ScenarioItem scenarioItem = ScenarioItem.builder()
          .name("Sword")
          .actions(new ArrayList<>())
          .build();
      Scenario scenario = Scenario.builder()
          .name("Test Scenario")
          .items(List.of(scenarioItem))
          .build();
      Event event = Event.builder()
          .name("Test Event")
          .description("Desc")
          .status(EventStatusEnum.UPCOMING)
          .scenario(scenario)
          .assignedRoles(new ArrayList<>())
          .build();

      given(gameSessionRepository.save(any(GameSession.class))).willAnswer(
          invocation -> invocation.getArgument(0));
      given(gameSessionMapper.toDetailedDTO(any(GameSession.class)))
          .willReturn(sampleGameSessionDTO);

      // when
      GameSessionDetailedResponseDTO result = gameSessionService.createGameSession(event);

      // then
      assertThat(result).isNotNull();
      verify(gameSessionRepository, times(1)).save(any(GameSession.class));
    }

    @Test
    @DisplayName("Should handle event with empty assigned roles")
    void givenEventWithNoAssignedRoles_whenCreate_thenHandlesGracefully() {
      // given
      Scenario scenario = Scenario.builder()
          .name("Empty Scenario")
          .items(new ArrayList<>())
          .build();
      Event event = Event.builder()
          .name("Empty Event")
          .description("Desc")
          .status(EventStatusEnum.UPCOMING)
          .scenario(scenario)
          .assignedRoles(new ArrayList<>())
          .build();

      given(gameSessionRepository.save(any(GameSession.class))).willAnswer(
          invocation -> invocation.getArgument(0));
      given(gameSessionMapper.toDetailedDTO(any(GameSession.class)))
          .willReturn(sampleGameSessionDTO);

      // when
      GameSessionDetailedResponseDTO result = gameSessionService.createGameSession(event);

      // then
      assertThat(result).isNotNull();
      verify(gameSessionRepository, times(1)).save(any(GameSession.class));
    }
  }

  @Nested
  @DisplayName("deleteGameSession")
  class DeleteGameSession {

    @Test
    @DisplayName("Should call repository deleteById")
    void givenId_whenDelete_thenCallsRepositoryDelete() {
      // given
      willDoNothing().given(gameSessionRepository).deleteById(sampleGameSessionId);

      // when
      gameSessionService.deleteGameSession(sampleGameSessionId);

      // then
      verify(gameSessionRepository, times(1)).deleteById(sampleGameSessionId);
    }
  }

  @Nested
  @DisplayName("getGameHistoryByGameId")
  class GetGameHistoryByGameId {

    @Test
    @DisplayName("Should return list of detailed action log DTOs")
    void givenGameId_whenGetHistory_thenReturnsDetailedLogs() {
      // given
      GameActionLog actionLog = GameActionLog.builder()
          .gameSession(sampleGameSession)
          .success(true)
          .message("Action performed")
          .timestamp(ZonedDateTime.now())
          .build();

      GameActionLogDetailedResponseDTO logDTO = GameActionLogDetailedResponseDTO.builder()
          .id(actionLog.getId())
          .success(true)
          .message("Action performed")
          .build();

      given(gameActionLogRepository.findByGameSession_Id(sampleGameSessionId))
          .willReturn(List.of(actionLog));
      given(gameActionLogMapper.toDetailedDTO(actionLog)).willReturn(logDTO);

      // when
      List<GameActionLogDetailedResponseDTO> result =
          gameSessionService.getGameHistoryByGameId(sampleGameSessionId);

      // then
      assertThat(result).isNotNull().hasSize(1);
      assertThat(result.get(0).getSuccess()).isTrue();
      assertThat(result.get(0).getMessage()).isEqualTo("Action performed");
    }

    @Test
    @DisplayName("Should return empty list when no history exists")
    void givenGameIdWithNoHistory_whenGetHistory_thenReturnsEmptyList() {
      // given
      given(gameActionLogRepository.findByGameSession_Id(sampleGameSessionId))
          .willReturn(Collections.emptyList());

      // when
      List<GameActionLogDetailedResponseDTO> result =
          gameSessionService.getGameHistoryByGameId(sampleGameSessionId);

      // then
      assertThat(result).isNotNull().isEmpty();
    }
  }

  @Nested
  @DisplayName("getAllGameHistory")
  class GetAllGameHistory {

    @Test
    @DisplayName("Should return list of summary action log DTOs")
    void givenHistoryExists_whenGetAllHistory_thenReturnsListOfSummaryDTOs() {
      // given
      GameActionLog actionLog = GameActionLog.builder()
          .gameSession(sampleGameSession)
          .success(true)
          .message("Action")
          .timestamp(ZonedDateTime.now())
          .build();

      GameActionLogSummaryResponseDTO logDTO = GameActionLogSummaryResponseDTO.builder()
          .id(actionLog.getId())
          .success(true)
          .message("Action")
          .build();

      given(gameActionLogRepository.findAll()).willReturn(List.of(actionLog));
      given(gameActionLogMapper.toDTO(actionLog)).willReturn(logDTO);

      // when
      List<GameActionLogSummaryResponseDTO> result = gameSessionService.getAllGameHistory();

      // then
      assertThat(result).isNotNull().hasSize(1);
      assertThat(result.get(0).getSuccess()).isTrue();
    }
  }
}
