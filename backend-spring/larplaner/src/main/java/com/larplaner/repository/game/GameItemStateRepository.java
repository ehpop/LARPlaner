package com.larplaner.repository.game;

import com.larplaner.model.game.GameItemState;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameItemStateRepository extends JpaRepository<GameItemState, UUID> {

  GameItemState getByScenarioItemId(UUID id);
}