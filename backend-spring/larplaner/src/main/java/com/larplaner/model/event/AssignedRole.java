package com.larplaner.model.event;

import com.larplaner.model.BaseEntity;
import com.larplaner.model.scenario.ScenarioRole;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "assigned_roles")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
public class AssignedRole extends BaseEntity {

  @ManyToOne
  @JoinColumn(name = "event_id")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Event event;

  @ManyToOne
  @JoinColumn(name = "scenario_role_id")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private ScenarioRole scenarioRole;

  private String assignedEmail;
}