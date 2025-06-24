package com.larplaner.repository.game;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.larplaner.model.game.GameActionLog;

public interface GameActionLogRepository extends JpaRepository<GameActionLog, UUID> {

  List<GameActionLog> findByGameSession_Id(UUID sessionId);

  List<GameActionLog> findByGameSession_IdAndPerformerRole_Id(UUID sessionId,
      UUID performerRoleId);
}