package com.larplaner.model.event;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * This class represents status that {@link Event} can be in. Use toString() to get name in
 * lowercase, use .name() to get name in uppercase.
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

  @JsonValue
  @Override
  public String toString() {
    return this.displayValue.toLowerCase();
  }

  @JsonCreator
  public static EventStatusEnum fromValue(String value) {
    if (value == null) {
      return null;
    }
    for (EventStatusEnum status : values()) {
      if (status.displayValue.equalsIgnoreCase(value)) {
        return status;
      }
    }

    throw new IllegalArgumentException("Unknown enum value: " + value);
  }
}