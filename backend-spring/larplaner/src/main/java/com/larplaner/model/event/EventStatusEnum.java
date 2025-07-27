package com.larplaner.model.event;

import lombok.Getter;

/**
 * This class represents status that {@link Event} can be in.
 * Use toString() to get name in lowercase, use .name() to
 * get name in uppercase.
 */
@Getter
public enum EventStatusEnum {
  UPCOMING("upcoming"),
  ACTIVE("active"),
  HISTORIC("historic");

  private final String displayValue;

  EventStatusEnum(String displayValue) {
    this.displayValue = displayValue;
  }

  @Override
  public String toString() {
    return this.displayValue.toLowerCase();
  }
}
