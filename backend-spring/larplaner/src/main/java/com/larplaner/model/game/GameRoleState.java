package com.larplaner.model.game;

import com.larplaner.model.BaseEntity;
import com.larplaner.model.scenario.ScenarioRole;
import com.larplaner.model.tag.Tag;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@Entity
@Table(name = "game_role_states")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class GameRoleState extends BaseEntity {

  @ManyToOne
  @JoinColumn(name = "scenario_role_id")
  private ScenarioRole scenarioRole;

  @ManyToOne
  @JoinColumn(name = "game_session_id")
  private GameSession gameSession;

  private String assignedEmail;
  private String assignedUserID;

  @ManyToMany
  private List<Tag> activeTags;

  @OneToMany(mappedBy = "performerRole")
  private List<GameActionLog> actionHistory;
}