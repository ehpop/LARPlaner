package com.larplaner.repository.game;

import com.larplaner.model.game.GameItemState;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameItemStateRepository extends JpaRepository<GameItemState, UUID> {

  Optional<GameItemState> findByGameSessionIdAndScenarioItemId(UUID gameSessionId, UUID scenarioItemId);
}