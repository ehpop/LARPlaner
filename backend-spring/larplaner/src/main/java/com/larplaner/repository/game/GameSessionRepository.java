package com.larplaner.repository.game;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.larplaner.model.game.GameSession;

public interface GameSessionRepository extends JpaRepository<GameSession, UUID> {
  Optional<GameSession> findByEventId(UUID id);
}
