package com.larplaner.service.admin.security;

import com.google.firebase.auth.FirebaseToken;
import com.larplaner.model.event.Event;
import com.larplaner.model.game.GameRoleState;
import com.larplaner.model.game.GameSession;
import com.larplaner.model.role.Role;
import com.larplaner.model.scenario.Scenario;
import com.larplaner.model.scenario.ScenarioRole;
import com.larplaner.repository.event.EventRepository;
import com.larplaner.repository.game.GameRoleStateRepository;
import com.larplaner.repository.game.GameSessionRepository;
import com.larplaner.repository.role.RoleRepository;
import com.larplaner.repository.scenario.ScenarioRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Collection;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Slf4j
@Service("securityService")
public class SecurityService {

  private final EventRepository eventRepository;
  private final GameSessionRepository gameSessionRepository;
  private final GameRoleStateRepository gameRoleStateRepository;
  private final RoleRepository roleRepository;
  private final ScenarioRepository scenarioRepository;

  public SecurityService(EventRepository eventRepository,
      GameSessionRepository gameSessionRepository,
      GameRoleStateRepository gameRoleStateRepository, RoleRepository roleRepository,
      ScenarioRepository scenarioRepository) {
    this.eventRepository = eventRepository;
    this.gameSessionRepository = gameSessionRepository;
    this.gameRoleStateRepository = gameRoleStateRepository;
    this.roleRepository = roleRepository;
    this.scenarioRepository = scenarioRepository;
  }

  public boolean isUserAssignedToEvent(UUID eventId) {
    Event event = eventRepository.findById(eventId).orElseThrow(EntityNotFoundException::new);

    FirebaseToken decodedToken = getFirebaseToken();

    return event.getEmailsAssignedToEvent().contains(decodedToken.getEmail());
  }

  public boolean isUserAssignedToGameSession(UUID gameSessionId) {
    GameSession gameSession = gameSessionRepository.findById(gameSessionId)
        .orElseThrow(EntityNotFoundException::new);

    return gameSession.getUserIdsAssignedToGameSession().contains(getFirebaseToken().getUid());
  }

  public boolean isUserAssignedToGameSessionRole(UUID gameSessionRoleId) {
    GameRoleState gameRoleState = gameRoleStateRepository.findById(gameSessionRoleId)
        .orElseThrow(EntityNotFoundException::new);

    return Objects.nonNull(gameRoleState.getAssignedUserID()) &&
        gameRoleState.getAssignedUserID().equals(getFirebaseToken().getUid());
  }

  public boolean isUserAssignedToRole(UUID roleId) {
    Role role = roleRepository.findById(roleId).orElseThrow(EntityNotFoundException::new);
    String userEmail = getFirebaseToken().getEmail();
    Collection<Event> userEvents = eventRepository.findAllByAssignedRoles_AssignedEmail(userEmail);

    return userEvents.stream().anyMatch(event ->
        event.getScenario()
            .getRoles()
            .stream()
            .map(ScenarioRole::getRole)
            .collect(Collectors.toSet())
            .contains(role));
  }


  public boolean isUserAssignedToScenario(UUID scenarioId) {
    Scenario scenario = scenarioRepository.findById(scenarioId)
        .orElseThrow(EntityNotFoundException::new);
    String userEmail = getFirebaseToken().getEmail();
    Collection<Event> userEvents = eventRepository.findAllByAssignedRoles_AssignedEmail(userEmail);

    return userEvents.stream().anyMatch(event ->
        event.getScenario().equals(scenario));
  }

  public static FirebaseToken getFirebaseToken() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return (FirebaseToken) authentication.getPrincipal();
  }

}
