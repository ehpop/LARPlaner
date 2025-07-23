package com.larplaner.model.tag;

import com.larplaner.model.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import lombok.extern.slf4j.Slf4j;

@Entity
@Table(name = "applied_tag")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
@Slf4j
public class AppliedTag extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "tag_id")
  private Tag tag;

  private String userID;
  private String userEmail;
  private ZonedDateTime appliedToUserAt;

  public boolean isTagActive() {
    Integer expiresAfter = tag.getExpiresAfterMinutes();
    if (Objects.isNull(expiresAfter) || expiresAfter == 0) {
      log.debug("Expires after was set to {} on tag {} so AppliedTag is active",
          expiresAfter,
          tag.getId());

      return true;
    }

    ZonedDateTime timeTagExpires = appliedToUserAt.plusMinutes(expiresAfter);
    log.debug("appliedToUserAt = {} + {} min = {} isBefore {} = {} ",
        appliedToUserAt,
        expiresAfter,
        timeTagExpires,
        ZonedDateTime.now(),
        timeTagExpires.isAfter(ZonedDateTime.now()));
    return timeTagExpires.isAfter(ZonedDateTime.now());
  }

}
