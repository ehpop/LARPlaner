package com.larplaner.model.game;

import com.larplaner.model.BaseEntity;
import com.larplaner.model.scenario.ScenarioItem;
import com.larplaner.model.tag.Tag;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "game_item_states")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
public class GameItemState extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "scenario_item_id")
  private ScenarioItem scenarioItem;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "game_session_id")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private GameSession gameSession;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "current_holder_role_id")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private GameRoleState currentHolderRole;

  @OneToMany(mappedBy = "targetItem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<GameActionLog> actionHistory;
}