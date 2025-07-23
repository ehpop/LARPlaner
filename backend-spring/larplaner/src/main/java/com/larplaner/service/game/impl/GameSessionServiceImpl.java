package com.larplaner.service.game.impl;

import com.larplaner.dto.game.GameSessionResponseDTO;
import com.larplaner.dto.game.action.GameActionRequestDTO;
import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;
import com.larplaner.dto.game.roleState.GameRoleStateResponseDTO;
import com.larplaner.dto.game.roleState.UpdateGameRoleStateRequestDTO;
import com.larplaner.dto.scenario.action.ScenarioActionResponseDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionResponseDTO;
import com.larplaner.mapper.game.GameSessionMapper;
import com.larplaner.mapper.game.action.GameActionLogMapper;
import com.larplaner.mapper.scenario.ScenarioActionMapper;
import com.larplaner.mapper.scenario.ScenarioItemActionMapper;
import com.larplaner.mapper.tag.TagMapper;
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
import java.util.Comparator;
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
  private final TagMapper tagMapper;
  private final GameRoleStateRepository gameRoleStateRepository;
  private final TagHelper tagHelper;
  private final ScenarioActionMapper scenarioActionMapper;
  private final ScenarioItemActionMapper scenarioItemActionMapper;

  @Override
  public List<GameSessionResponseDTO> getAllGameSessions() {
    return gameSessionRepository.findAll().stream()
        .map(gameSessionMapper::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public GameSessionResponseDTO getGameSessionById(UUID id) {
    return gameSessionRepository.findById(id)
        .map(gameSessionMapper::toDTO)
        .orElse(null);
  }

  @Override
  @Transactional
  public GameSessionResponseDTO createGameSession(Event event) {
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

    return gameSessionMapper.toDTO(savedGameSession);
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
  public List<GameActionLogResponseDTO> getAllGameHistory() {
    return gameActionLogRepository.findAll().stream()
        .map(gameActionLogMapper::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public GameActionLogResponseDTO getGameHistoryById(UUID id) {
    return gameActionLogRepository.findById(id)
        .map(gameActionLogMapper::toDTO)
        .orElse(null);
  }

  @Override
  public List<GameActionLogResponseDTO> getGameHistoryByGameId(UUID gameId) {
    return gameActionLogRepository.findByGameSession_Id(gameId).stream()
        .map(gameActionLogMapper::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public List<GameActionLogResponseDTO> getUserGameHistoryByGameId(UUID gameId){
    return getUserGameHistoryByGameId(SecurityService.getFirebaseToken().getUid(), gameId);
  }

  @Override
  public List<GameActionLogResponseDTO> getUserGameHistoryByGameId(String userId,
      UUID gameId) {
    GameSessionResponseDTO gameSession = getGameSessionById(gameId);
    if (gameSession == null) {
      return new ArrayList<>();
    }

    UUID userRoleId = gameSession.getAssignedRoles().stream()
        .filter(role -> role.getAssignedUserID().equals(userId))
        .map(GameRoleStateResponseDTO::getId)
        .findFirst()
        .orElse(null);

    if (userRoleId == null) {
      return new ArrayList<>();
    }

    return gameActionLogRepository.findByGameSession_IdAndPerformerRole_Id(gameId, userRoleId)
        .stream()
        .sorted(Comparator.comparing(GameActionLog::getTimestamp).reversed())
        .map(gameActionLogMapper::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public GameActionLogResponseDTO createGameHistory(GameActionLogResponseDTO gameActionLogDTO) {
    GameActionLog gameActionLog = gameActionLogMapper.toEntity(gameActionLogDTO);
    return gameActionLogMapper.toDTO(gameActionLogRepository.save(gameActionLog));
  }

  public GameActionLogResponseDTO performAction(UUID gameSessionId,
      GameActionRequestDTO gameActionRequestDTO) {
    var game = gameSessionRepository.findById(gameSessionId)
        .orElseThrow(EntityNotFoundException::new);
    var userRole = game.getAssignedRoles().stream()
        .filter(assignedRole -> assignedRole.getScenarioRole().getId()
            .equals(gameActionRequestDTO.getPerformerRoleId()))
        .findFirst().orElseThrow(EntityNotFoundException::new);

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

    return createGameHistory(GameActionLogResponseDTO.builder()
        .gameSessionId(gameSessionId)
        .actionId(actionToPerform.getId())
        .success(success)
        .message(messageToDisplay)
        .removedTags(tagsToRemove.stream().map(tagMapper::toDTO).toList())
        .appliedTags(tagsToApply.stream().map(tagMapper::toDTO).toList())
        .performerRoleId(userRole.getId())
        .targetItemId(gameActionRequestDTO.getTargetItemId())
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

  public GameSessionResponseDTO updateRoleState(UUID roleStateID,
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

    return gameSessionMapper.toDTO(
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