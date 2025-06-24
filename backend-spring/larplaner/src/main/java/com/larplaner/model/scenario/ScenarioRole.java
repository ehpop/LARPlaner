package com.larplaner.model.scenario;

import com.larplaner.model.BaseEntity;
import com.larplaner.model.role.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.ToString.Exclude;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "scenario_roles")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
public class ScenarioRole extends BaseEntity {

  @ManyToOne
  @JoinColumn(name = "role_id")
  private Role role;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @ManyToOne
  @JoinColumn(name = "scenario_id")
  private Scenario scenario;

  @Column(length = 4096)
  private String descriptionForGM;

  @Column(length = 4096)
  private String descriptionForOwner;

  @Column(length = 4096)
  private String descriptionForOthers;

  @ToString.Include(name = "scenarioId")
  public String getScenarioId(){
    return (scenario != null) ? scenario.getId().toString() : null;
  }
}