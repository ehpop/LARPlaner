package com.larplaner.model;

import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@MappedSuperclass
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
public abstract class AbstractEntity<T> extends Auditable {

  public abstract T getId();

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AbstractEntity<?> that = (AbstractEntity<?>) o;
    return getId() != null && getId().equals(that.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
