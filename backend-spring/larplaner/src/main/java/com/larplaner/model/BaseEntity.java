package com.larplaner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@MappedSuperclass
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
public class BaseEntity extends AbstractEntity<UUID> {

  @Id
  @Column(updatable = false, nullable = false)
  private final UUID id = UUID.randomUUID();

}