package com.larplaner.model.event;

import com.larplaner.exception.EntityCouldNotBeAdded;
import com.larplaner.model.BaseEntity;
import com.larplaner.model.game.GameSession;
import com.larplaner.model.scenario.Scenario;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
import org.springframework.util.StringUtils;

@Entity
@Table(name = "events")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
public class Event extends BaseEntity {

  private String name;

  @Column(length = 4096)
  private String description;

  @Column(length = 4096)
  private String img;

  private ZonedDateTime date;

  @Default
  private EventStatusEnum status = EventStatusEnum.UPCOMING;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "scenario_id")
  private Scenario scenario;

  @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "game_session_id")
  private GameSession gameSession;

  @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @Default
  private List<AssignedRole> assignedRoles = new ArrayList<>();

  public void addAssignedRoleToEvent(AssignedRole assignedRole) {
    if (assignedRoles.stream()
        .anyMatch(r -> StringUtils.hasText(r.getAssignedEmail())
            && assignedRole.getAssignedEmail().equals(r.getAssignedEmail()))) {
      throw new EntityCouldNotBeAdded(
          String.format("Event %s already has role with assigned email %s", getId(),
              assignedRole.getAssignedEmail()));
    }

    this.assignedRoles.add(assignedRole);
    assignedRole.setEvent(this);
  }

  public Set<String> getEmailsAssignedToEvent() {
    return this.assignedRoles.stream()
        .map(AssignedRole::getAssignedEmail)
        .filter(StringUtils::hasText)
        .collect(Collectors.toSet());
  }

}