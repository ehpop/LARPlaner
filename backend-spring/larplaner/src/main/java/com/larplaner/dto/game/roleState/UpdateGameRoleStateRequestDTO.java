package com.larplaner.dto.game.roleState;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UpdateGameRoleStateRequestDTO {

  @Default
  private List<UUID> activeTags = new ArrayList<>();

}
