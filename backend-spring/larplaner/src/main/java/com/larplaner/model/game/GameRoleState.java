package com.larplaner.model.game;

import com.larplaner.model.BaseEntity;
import com.larplaner.model.scenario.ScenarioRole;
import com.larplaner.model.tag.AppliedTag;
import com.larplaner.model.tag.Tag;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.Builder.Default;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "game_role_states")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
public class GameRoleState extends BaseEntity {

  @ManyToOne
  @JoinColumn(name = "scenario_role_id")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private ScenarioRole scenarioRole;

  @ManyToOne
  @JoinColumn(name = "game_session_id")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private GameSession gameSession;

  private String assignedEmail;
  private String assignedUserID;

  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @Default
  private List<AppliedTag> appliedTags = new ArrayList<>();

  @OneToMany(mappedBy = "performerRole", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @Default
  private List<GameActionLog> actionHistory = new ArrayList<>();

  public Collection<Tag> getAllActiveTags(){
    return appliedTags.stream()
        .filter(AppliedTag::isTagActive)
        .map(AppliedTag::getTag)
        .collect(Collectors.toSet());
  }

  public Optional<AppliedTag> findAppliedTagByTag(Tag tag){
    return appliedTags
        .stream()
        .filter(AppliedTag::isTagActive)
        .filter(t -> t.getTag().equals(tag))
        .findFirst();
  }

}