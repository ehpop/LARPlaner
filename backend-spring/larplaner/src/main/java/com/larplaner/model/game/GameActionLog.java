package com.larplaner.model.game;

import com.larplaner.model.BaseEntity;
import com.larplaner.model.action.Action;
import com.larplaner.model.tag.Tag;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@Entity
@Table(name = "game_action_logs")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class GameActionLog extends BaseEntity {

  @ManyToOne
  @JoinColumn(name = "session_id")
  private GameSession gameSession;

  @ManyToOne
  @JoinColumn(name = "action_id")
  private Action action;

  private String timestamp;

  @ManyToOne
  @JoinColumn(name = "performer_role_id")
  private GameRoleState performerRole;

  @ManyToOne
  @JoinColumn(name = "target_item_id")
  private GameItemState targetItem;

  private Boolean success;

  @ManyToMany
  private List<Tag> appliedTags;

  @ManyToMany
  private List<Tag> removedTags;

  private String message;
}