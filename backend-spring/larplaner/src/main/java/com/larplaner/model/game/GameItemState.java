package com.larplaner.model.game;

import com.larplaner.model.BaseEntity;
import com.larplaner.model.scenario.ScenarioItem;
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
@Table(name = "game_item_states")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class GameItemState extends BaseEntity {

  @ManyToOne
  @JoinColumn(name = "scenario_item_id")
  private ScenarioItem scenarioItem;

  @ManyToOne
  @JoinColumn(name = "game_session_id")
  private GameSession gameSession;

  @ManyToOne
  @JoinColumn(name = "current_holder_role_id")
  private GameRoleState currentHolderRole;

  @ManyToMany
  private List<Tag> activeTags;

  @OneToMany(mappedBy = "targetItem")
  private List<GameActionLog> actionHistory;
}