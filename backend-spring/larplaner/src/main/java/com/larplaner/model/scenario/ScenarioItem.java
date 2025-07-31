package com.larplaner.model.scenario;

import com.larplaner.model.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder.Default;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import lombok.extern.slf4j.Slf4j;

@Entity
@Table(name = "scenario_items")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
@Slf4j
public class ScenarioItem extends BaseEntity {

  @ManyToOne
  @JoinColumn(name = "scenario_id")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Scenario scenario;

  private String name;

  @Column(length = 4096)
  private String description;

  @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @Default
  private List<ScenarioItemAction> actions = new ArrayList<>();

  public void addScenarioItemAction(ScenarioItemAction scenarioItemAction) {
    this.actions.add(scenarioItemAction);
    scenarioItemAction.setItem(this);
  }

}