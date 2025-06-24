package com.larplaner.dto.game;

import com.larplaner.model.game.GameStatusEnum;
import lombok.Data;

@Data
public class UpdateGameSessionRequestDTO {

  private GameStatusEnum status;

}