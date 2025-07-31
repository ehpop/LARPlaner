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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
public class ScenarioItemAction extends Action {

  @ManyToOne
  @JoinColumn(name = "item_id")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private ScenarioItem item;

  public ScenarioItemAction(Action action) {
    super();
    this.setName(action.getName());
    this.setDescription(action.getDescription());
    this.setMessageOnSuccess(action.getMessageOnSuccess());
    this.setMessageOnFailure(action.getMessageOnFailure());
    this.setRequiredTagsToDisplay(action.getRequiredTagsToDisplay());
    this.setRequiredTagsToSucceed(action.getRequiredTagsToSucceed());
    this.setTagsToApplyOnSuccess(action.getTagsToApplyOnSuccess());
    this.setTagsToApplyOnFailure(action.getTagsToApplyOnFailure());
    this.setTagsToRemoveOnSuccess(action.getTagsToRemoveOnSuccess());
    this.setTagsToRemoveOnFailure(action.getTagsToRemoveOnFailure());
  }

  @ToString.Include(name = "itemId")
  public String getItemId() {
    return (item != null) ? item.getId().toString() : null;
  }
}