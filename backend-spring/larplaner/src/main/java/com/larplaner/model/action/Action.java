package com.larplaner.model.action;

import com.larplaner.model.BaseEntity;
import com.larplaner.model.tag.Tag;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
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

@Entity
@Table(name = "actions")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
public class Action extends BaseEntity {

  @NotBlank(message = "'Name' cannot be blank")
  private String name;

  @NotBlank(message = "'Description' value cannot be blank")
  @Column(length = 4096)
  private String description;

  @NotBlank(message = "'Message on success' cannot be blank")
  @Column(length = 1024)
  private String messageOnSuccess;

  @NotBlank(message = "'Message on failure' cannot be blank")
  @Column(length = 1024)
  private String messageOnFailure;

  /** An object must have ALL of these tags to be displayed. */
  @ManyToMany
  @Default
  private List<Tag> requiredTagsToDisplay = new ArrayList<>();

  /** An object must have NONE of these tags to be displayed. */
  @ManyToMany
  @Default
  private List<Tag> forbiddenTagsToDisplay = new ArrayList<>();

  /** An object must have ALL of these tags to succeed. */
  @ManyToMany
  @Default
  private List<Tag> requiredTagsToSucceed = new ArrayList<>();

  /** An object must have NONE of these tags to succeed. */
  @ManyToMany
  @Default
  private List<Tag> forbiddenTagsToSucceed = new ArrayList<>();

  @ManyToMany
  @Default
  private List<Tag> tagsToApplyOnSuccess = new ArrayList<>();

  @ManyToMany
  @Default
  private List<Tag> tagsToApplyOnFailure = new ArrayList<>();

  @ManyToMany
  @Default
  private List<Tag> tagsToRemoveOnSuccess = new ArrayList<>();

  @ManyToMany
  @Default
  private List<Tag> tagsToRemoveOnFailure = new ArrayList<>();
}