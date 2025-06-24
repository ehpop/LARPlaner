package com.larplaner.model.scenario;

import com.larplaner.model.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder.Default;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "scenarios")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
public class Scenario extends BaseEntity {

  private String name;

  @Column(length = 4096)
  private String description;

  @OneToMany(mappedBy = "scenario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @Default
  private List<ScenarioRole> roles = new ArrayList<>();

  @OneToMany(mappedBy = "scenario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @Default
  private List<ScenarioItem> items = new ArrayList<>();

  @OneToMany(mappedBy = "scenario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @Default
  private List<ScenarioAction> actions = new ArrayList<>();

  public void addScenarioRole(ScenarioRole scenarioRole) {
    this.roles.add(scenarioRole);
    scenarioRole.setScenario(this);
  }

  public void removeScenarioRole(ScenarioRole scenarioRole) {
    this.roles.remove(scenarioRole);
    scenarioRole.setScenario(null);
  }

  public void addScenarioItem(ScenarioItem scenarioItem) {
    this.items.add(scenarioItem);
    scenarioItem.setScenario(this);
  }

  public void removeScenarioItem(ScenarioItem scenarioItem) {
    this.items.remove(scenarioItem);
    scenarioItem.setScenario(null);
  }

  public void addScenarioAction(ScenarioAction scenarioAction) {
    this.actions.add(scenarioAction);
    scenarioAction.setScenario(this);
  }

  public void removeScenarioAction(ScenarioAction scenarioAction) {
    this.actions.remove(scenarioAction);
    scenarioAction.setScenario(null);
  }

}