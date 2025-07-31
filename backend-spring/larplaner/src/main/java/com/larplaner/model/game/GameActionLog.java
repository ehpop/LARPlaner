package com.larplaner.model.game;

import com.larplaner.model.BaseEntity;
import com.larplaner.model.action.Action;
import com.larplaner.model.tag.Tag;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "game_action_logs")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
public class GameActionLog extends BaseEntity {

  @ManyToOne
  @JoinColumn(name = "session_id")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private GameSession gameSession;

  @ManyToOne
  @JoinColumn(name = "action_id")
  private Action action;

  private ZonedDateTime timestamp;

  @ManyToOne
  @JoinColumn(name = "performer_role_id")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private GameRoleState performerRole;

  @ManyToOne
  @JoinColumn(name = "target_item_id")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private GameItemState targetItem;

  private Boolean success;

  @ManyToMany
  private List<Tag> appliedTags;

  @ManyToMany
  private List<Tag> removedTags;

  private String message;
}