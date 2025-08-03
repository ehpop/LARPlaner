package com.larplaner.dto;

import jakarta.persistence.MappedSuperclass;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@SuperBuilder
@MappedSuperclass
public abstract class BaseResponseDTO {

  private UUID id;
}