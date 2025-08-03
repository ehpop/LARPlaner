package com.larplaner.repository.game;

import com.larplaner.model.game.GameRoleState;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRoleStateRepository extends JpaRepository<GameRoleState, UUID> {

  Optional<GameRoleState> findByGameSession_IdAndAssignedUserID(UUID gameId, String userId);
}