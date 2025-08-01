package com.larplaner.model.game;

import com.larplaner.model.BaseEntity;
import com.larplaner.model.event.Event;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "game_sessions")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
public class GameSession extends BaseEntity {

  private ZonedDateTime startTime;
  private ZonedDateTime endTime;

  @OneToOne(mappedBy = "gameSession")
  private Event event;

  @OneToMany(mappedBy = "gameSession", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @Default
  private List<GameRoleState> assignedRoles = new ArrayList<>();

  @OneToMany(mappedBy = "gameSession", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @Default
  private List<GameItemState> items = new ArrayList<>();

  @OneToMany(mappedBy = "gameSession", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @OrderBy("timestamp DESC ")
  @Default
  private List<GameActionLog> actions = new ArrayList<>();

  public Set<String> getUserIdsAssignedToGameSession() {
    return assignedRoles.stream().map(GameRoleState::getAssignedUserID).collect(Collectors.toSet());
  }

}
