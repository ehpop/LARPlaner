package com.larplaner.model.game;

import com.larplaner.model.BaseEntity;
import com.larplaner.model.event.Event;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@Entity
@Table(name = "game_sessions")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class GameSession extends BaseEntity {

  private GameStatusEnum status;
  private String startTime;
  private String endTime;

  @OneToOne(mappedBy = "gameSession")
  private Event event;

  @OneToMany(mappedBy = "gameSession")
  private List<GameRoleState> assignedRoles;

  @OneToMany(mappedBy = "gameSession")
  private List<GameItemState> items;

  @OneToMany(mappedBy = "gameSession")
  private List<GameActionLog> actions;
}
