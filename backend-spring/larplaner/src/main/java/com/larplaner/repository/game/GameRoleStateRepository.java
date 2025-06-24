package com.larplaner.repository.game;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.larplaner.model.game.GameRoleState;

public interface GameRoleStateRepository extends JpaRepository<GameRoleState, UUID> {

}