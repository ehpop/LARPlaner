package com.larplaner.model.scenario;

import com.larplaner.model.action.Action;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
public class ScenarioAction extends Action {

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @ManyToOne
  @JoinColumn(name = "scenario_id")
  private Scenario scenario;

  /**
   * Constructor to create a ScenarioAction based on a general Action entity. Copies relevant fields
   * from the base Action.
   *
   * @param baseAction The base Action entity.
   */
  public ScenarioAction(Action baseAction) {
    super();
    if (baseAction != null) {
      this.setName(baseAction.getName());
      this.setDescription(baseAction.getDescription());
      this.setMessageOnSuccess(baseAction.getMessageOnSuccess());
      this.setMessageOnFailure(baseAction.getMessageOnFailure());
      this.setRequiredTagsToDisplay(baseAction.getRequiredTagsToDisplay());
      this.setRequiredTagsToSucceed(baseAction.getRequiredTagsToSucceed());
      this.setForbiddenTagsToDisplay(baseAction.getForbiddenTagsToDisplay());
      this.setForbiddenTagsToSucceed(baseAction.getForbiddenTagsToSucceed());
      this.setTagsToApplyOnSuccess(baseAction.getTagsToApplyOnSuccess());
      this.setTagsToApplyOnFailure(baseAction.getTagsToApplyOnFailure());
      this.setTagsToRemoveOnSuccess(baseAction.getTagsToRemoveOnSuccess());
      this.setTagsToRemoveOnFailure(baseAction.getTagsToRemoveOnFailure());
    }
  }

  @ToString.Include(name = "scenarioId")
  public String getScenarioId() {
    return (scenario != null) ? scenario.getId().toString() : null;
  }
}