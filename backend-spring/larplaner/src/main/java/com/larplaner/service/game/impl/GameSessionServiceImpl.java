package com.larplaner.service.game.impl;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.game.GameSessionDetailedResponseDTO;
import com.larplaner.dto.game.action.GameActionRequestDTO;
import com.larplaner.dto.game.actionLog.GameActionLogDetailedResponseDTO;
import com.larplaner.dto.game.actionLog.GameActionLogSummaryResponseDTO;
import com.larplaner.dto.game.roleState.GameRoleStateSummaryResponseDTO;
import com.larplaner.dto.game.roleState.UpdateGameRoleStateRequestDTO;
import com.larplaner.dto.scenario.action.ScenarioActionResponseDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionResponseDTO;
import com.larplaner.mapper.game.GameSessionMapper;
import com.larplaner.mapper.game.action.GameActionLogMapper;
import com.larplaner.mapper.game.role.GameRoleStateMapper;
import com.larplaner.mapper.scenario.ScenarioActionMapper;
import com.larplaner.mapper.scenario.ScenarioItemActionMapper;
import com.larplaner.model.action.Action;
import com.larplaner.model.event.Event;
import com.larplaner.model.game.GameActionLog;
import com.larplaner.model.game.GameItemState;
import com.larplaner.model.game.GameRoleState;
import com.larplaner.model.game.GameSession;
import com.larplaner.model.scenario.Scenario;
import com.larplaner.model.tag.AppliedTag;
import com.larplaner.model.tag.Tag;
import com.larplaner.repository.game.GameActionLogRepository;
import com.larplaner.repository.game.GameItemStateRepository;
import com.larplaner.repository.game.GameRoleStateRepository;
import com.larplaner.repository.game.GameSessionRepository;
import com.larplaner.repository.scenario.ScenarioActionRepository;
import com.larplaner.repository.scenario.ScenarioItemActionRepository;
import com.larplaner.service.admin.firebase.UserLookupService;
import com.larplaner.service.admin.security.SecurityService;
import com.larplaner.service.game.GameSessionService;
import com.larplaner.service.tag.helper.TagHelper;
import jakarta.persistence.EntityNotFoundException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameSessionServiceImpl implements GameSessionService {

  private final GameSessionRepository gameSessionRepository;
  private final GameActionLogRepository gameActionLogRepository;
  private final GameSessionMapper gameSessionMapper;
  private final GameActionLogMapper gameActionLogMapper;
  private final UserLookupService userLookupService;
  private final ScenarioActionRepository scenarioActionRepository;
  private final ScenarioItemActionRepository scenarioItemActionRepository;
  private final GameRoleStateRepository gameRoleStateRepository;
  private final TagHelper tagHelper;
  private final ScenarioActionMapper scenarioActionMapper;
  private final ScenarioItemActionMapper scenarioItemActionMapper;
  private final GameItemStateRepository gameItemStateRepository;
  private final GameRoleStateMapper gameRoleStateMapper;

  @Override
  public List<GameSessionDetailedResponseDTO> getAllGameSessions() {
    return gameSessionRepository.findAll().stream()
        .map(gameSessionMapper::toDetailedDTO)
        .collect(Collectors.toList());
  }

  @Override
  public GameSessionDetailedResponseDTO getGameSessionById(UUID id) {
    return gameSessionRepository.findById(id)
        .map(gameSessionMapper::toDetailedDTO)
        .orElse(null);
  }

  @Override
  @Transactional
  public GameSessionDetailedResponseDTO createGameSession(Event event) {
    GameSession gameSession = GameSession.builder()
        .event(event)
        .startTime(ZonedDateTime.now())
        .build();

    List<GameRoleState> gameRoles = buildAssignedRolesFromEvent(event, gameSession);
    List<GameItemState> gameItems = buildItemsFromScenario(event.getScenario(), gameSession);

    gameSession.setAssignedRoles(gameRoles);
    gameSession.setItems(gameItems);
    gameSession.setActions(new ArrayList<>());

    event.setGameSession(gameSession);

    GameSession savedGameSession = gameSessionRepository.save(gameSession);

    return gameSessionMapper.toDetailedDTO(savedGameSession);
  }

  private List<GameRoleState> buildAssignedRolesFromEvent(Event event, GameSession gameSession) {
    if (Objects.isNull(event.getAssignedRoles()) || event.getAssignedRoles().isEmpty()) {
      return new ArrayList<>();
    }

    var userIDs = userLookupService.getUserIDsByEmails(event.getEmailsAssignedToEvent());

    return event.getAssignedRoles().stream()
        .map(assignedRole -> GameRoleState.builder()
            .gameSession(gameSession)
            .scenarioRole(assignedRole.getScenarioRole())
            .assignedEmail(assignedRole.getAssignedEmail())
            .assignedUserID(userIDs.get(assignedRole.getAssignedEmail()))
            .actionHistory(new ArrayList<>())
            .appliedTags(assignedRole.getScenarioRole().getRole().getTags().stream().map(tag ->
                buildAppliedTag(tag,
                    userIDs.get(assignedRole.getAssignedEmail()),
                    assignedRole.getAssignedEmail())
            ).toList())
            .build())
        .collect(Collectors.toCollection(ArrayList::new));
  }

  private List<GameItemState> buildItemsFromScenario(Scenario scenario, GameSession gameSession) {
    if (Objects.isNull(scenario) || Objects.isNull(scenario.getItems())) {
      return new ArrayList<>();
    }

    return scenario.getItems().stream()
        .map(scenarioItem -> GameItemState.builder()
            .gameSession(gameSession)
            .scenarioItem(scenarioItem)
            .actionHistory(new ArrayList<>())
            .build())
        .collect(Collectors.toCollection(ArrayList::new));
  }

  @Override
  public void deleteGameSession(UUID id) {
    gameSessionRepository.deleteById(id);
  }

  @Override
  public List<GameActionLogSummaryResponseDTO> getAllGameHistory() {
    return gameActionLogRepository.findAll()
        .stream()
        .map(gameActionLogMapper::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public GameActionLogSummaryResponseDTO getGameHistoryById(UUID id) {
    return gameActionLogRepository
        .findById(id)
        .map(gameActionLogMapper::toDTO)
        .orElse(null);
  }

  @Override
  public List<GameActionLogDetailedResponseDTO> getGameHistoryByGameId(UUID gameId) {
    return gameActionLogRepository
        .findByGameSession_Id(gameId)
        .stream()
        .map(gameActionLogMapper::toDetailedDTO)
        .collect(Collectors.toList());
  }

  @Override
  public List<GameActionLogSummaryResponseDTO> getUserGameHistoryByGameId(UUID gameId) {
    return getUserGameHistoryByGameId(SecurityService.getFirebaseToken().getUid(), gameId);
  }

  @Override
  public List<GameActionLogSummaryResponseDTO> getUserGameHistoryByGameId(String userId,
      UUID gameId) {
    GameSessionDetailedResponseDTO gameSession = getGameSessionById(gameId);
    if (gameSession == null) {
      return new ArrayList<>();
    }

    UUID userRoleId = gameSession.getAssignedRoles().stream()
        .filter(role -> role.getAssignedUserID().equals(userId))
        .map(BaseResponseDTO::getId)
        .findFirst()
        .orElse(null);

    if (userRoleId == null) {
      return new ArrayList<>();
    }

    return gameActionLogRepository.findByGameSession_IdAndPerformerRole_Id(gameId, userRoleId)
        .stream()
        .map(gameActionLogMapper::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public GameActionLogSummaryResponseDTO createGameHistory(GameActionLog gameActionLog) {
    return gameActionLogMapper.toDTO(gameActionLogRepository.save(gameActionLog));
  }

  public GameActionLogSummaryResponseDTO performAction(UUID gameSessionId,
      GameActionRequestDTO gameActionRequestDTO) {
    var game = gameSessionRepository.findById(gameSessionId)
        .orElseThrow(EntityNotFoundException::new);

    var userRole = game.getAssignedRoles().stream()
        .filter(assignedRole -> assignedRole.getScenarioRole().getId()
            .equals(gameActionRequestDTO.getPerformerRoleId()))
        .findFirst().orElseThrow(EntityNotFoundException::new);

    var targetItem = Objects.nonNull(gameActionRequestDTO.getTargetItemId())
        ? gameItemStateRepository.findByScenarioItemId(gameActionRequestDTO.getTargetItemId())
        .orElseThrow(EntityNotFoundException::new)
        : null;

    var actionToPerform = Objects.isNull(gameActionRequestDTO.getTargetItemId())
        ? scenarioActionRepository.getReferenceById(gameActionRequestDTO.getActionId())
        : scenarioItemActionRepository.getReferenceById(gameActionRequestDTO.getActionId());

    var doesUserHaveEveryTagRequired = doesUserHaveEveryTagRequired(userRole, actionToPerform);
    var doesUserHaveAnyForbiddenTags = doesUserHaveAnyForbiddenTags(userRole, actionToPerform);
    log.debug("UserRole {} for email {}", userRole.getId(), userRole.getAssignedEmail());
    log.debug("doesUserHaveEveryTagRequired = {}, doesUserHaveAnyForbiddenTags {}",
        doesUserHaveEveryTagRequired,
        doesUserHaveAnyForbiddenTags);

    var success = doesUserHaveEveryTagRequired && !doesUserHaveAnyForbiddenTags;

    var tagsToRemove = success
        ? actionToPerform.getTagsToRemoveOnSuccess()
        : actionToPerform.getTagsToRemoveOnFailure();

    var tagsToApply = success
        ? actionToPerform.getTagsToApplyOnSuccess()
        : actionToPerform.getTagsToApplyOnFailure();

    var messageToDisplay = success
        ? actionToPerform.getMessageOnSuccess()
        : actionToPerform.getMessageOnFailure();

    log.debug("success = {}", success);
    log.debug("tagsToRemove = {}", tagsToRemove);
    log.debug("tagsToApply = {}", tagsToApply);
    log.debug("messageToDisplay = {}", messageToDisplay);

    updateAndRemoveUserTags(userRole, tagsToRemove, tagsToApply);

    gameRoleStateRepository.save(userRole);

    return createGameHistory(GameActionLog.builder()
        .gameSession(game)
        .action(actionToPerform)
        .success(success)
        .message(messageToDisplay)
        .removedTags(tagsToRemove)
        .appliedTags(tagsToApply)
        .performerRole(userRole)
        .targetItem(Objects.isNull(targetItem) ? null : targetItem)
        .timestamp(ZonedDateTime.now())
        .build());
  }

  private void updateAndRemoveUserTags(GameRoleState userRole, List<Tag> tagsToRemove,
      List<Tag> tagsToApply) {
    var tagsToModify = tagsToApply
        .stream().filter(t -> userRole.getAllActiveTags().contains(t))
        .toList();

    var tagsToAdd = tagsToApply.
        stream().filter(t -> !userRole.getAllActiveTags().contains(t))
        .toList();

    userRole.getAppliedTags().removeIf(appliedTag -> tagsToRemove.contains(appliedTag.getTag()));

    userRole.getAppliedTags().addAll(
        tagsToAdd
            .stream()
            .map(tag -> buildAppliedTag(tag, userRole.getAssignedUserID(),
                userRole.getAssignedEmail())
            ).toList());

    //TODO: Test, this should "refresh" tag if user already has it, instead of applying it again
    // MAYBE move this logic to GameRoleState idk
    tagsToModify.forEach(tag -> {
      var appliedTag = userRole.findAppliedTagByTag(tag).orElseThrow(EntityNotFoundException::new);
      appliedTag.setAppliedToUserAt(ZonedDateTime.now());
    });
  }

  private boolean doesUserHaveEveryTagRequired(GameRoleState userRole, Action actionToPerform) {
    return userRole.getAllActiveTags()
        .containsAll(actionToPerform.getRequiredTagsToSucceed());
  }

  private boolean doesUserHaveAnyForbiddenTags(GameRoleState userRole, Action actionToPerform) {
    return userRole.getAllActiveTags()
        .stream()
        .anyMatch(actionToPerform.getRequiredTagsToSucceed()::contains);
  }

  public GameSessionDetailedResponseDTO updateRoleState(UUID roleStateID,
      UpdateGameRoleStateRequestDTO requestDTO) {
    var userRole = gameRoleStateRepository.findById(roleStateID)
        .orElseThrow(EntityNotFoundException::new);

    var tagsInRole = userRole.getAppliedTags().stream().map(AppliedTag::getTag)
        .collect(Collectors.toSet());
    var tagsInRequest = new HashSet<>(tagHelper.processTags(requestDTO.getActiveTags()));

    var tagsToAdd = tagsInRequest
        .stream()
        .filter(o -> !tagsInRole.contains(o))
        .map(tag ->
            buildAppliedTag(tag, userRole.getAssignedUserID(), userRole.getAssignedEmail()))
        .toList();

    var tagsToRemove = userRole.getAppliedTags()
        .stream().filter(o -> !tagsInRequest.contains(o.getTag()))
        .collect(Collectors.toSet());

    //TODO: check this later
    userRole.getAppliedTags().addAll(tagsToAdd);
    userRole.getAppliedTags().removeAll(tagsToRemove);

    return gameSessionMapper.toDetailedDTO(
        gameRoleStateRepository.save(userRole).getGameSession()
    );
  }

  @Override
  public List<ScenarioActionResponseDTO> getAvailableActionsForUser(UUID gameSessionRoleId) {
    var gameRoleState = gameRoleStateRepository.findById(gameSessionRoleId)
        .orElseThrow(EntityNotFoundException::new);

    var scenario = gameRoleState.getGameSession().getEvent().getScenario();

    return scenario.getActions()
        .stream()
        .filter(action -> canActionBeDisplayedForUser(gameRoleState, action))
        .map(scenarioActionMapper::toDTO)
        .toList();
  }

  @Override
  public List<ScenarioItemActionResponseDTO> getAvailableItemActionsForUser(UUID gameSessionRoleId,
      UUID itemId) {
    var gameRoleState = gameRoleStateRepository.findById(gameSessionRoleId)
        .orElseThrow(EntityNotFoundException::new);

    var scenarioItem = gameRoleState.getGameSession().getEvent().getScenario().getItems()
        .stream()
        .filter(item -> item.getId().equals(itemId))
        .findFirst()
        .orElseThrow(EntityNotFoundException::new);

    return scenarioItem.getActions()
        .stream()
        .filter(action -> canActionBeDisplayedForUser(gameRoleState, action))
        .map(scenarioItemActionMapper::toDTO)
        .toList();
  }

  @Override
  public GameRoleStateSummaryResponseDTO getUserRoleStateForUserId(UUID gameId, String userId) {
    var foundUserRole = gameRoleStateRepository.findByGameSession_IdAndAssignedUserID(gameId,
            userId)
        .orElseThrow(EntityNotFoundException::new);

    return gameRoleStateMapper.toDTO(foundUserRole);
  }

  private boolean canActionBeDisplayedForUser(GameRoleState gameRoleState, Action action) {
    Collection<Tag> allActiveTags = gameRoleState.getAllActiveTags();
    var doesUserHaveAllRequiredTags = allActiveTags.containsAll(action.getRequiredTagsToDisplay());
    var doesUserHaveAnyForbiddenTags = action.getForbiddenTagsToDisplay()
        .stream()
        .anyMatch(allActiveTags::contains);

    return doesUserHaveAllRequiredTags && !doesUserHaveAnyForbiddenTags;
  }

  private AppliedTag buildAppliedTag(Tag tag, String userID, String email) {
    return AppliedTag.builder()
        .appliedToUserAt(ZonedDateTime.now())
        .tag(tag)
        .userID(userID)
        .userEmail(email)
        .build();
  }

}