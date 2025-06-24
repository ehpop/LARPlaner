package com.larplaner.repository.game;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.larplaner.model.game.GameItemState;

public interface GameItemStateRepository extends JpaRepository<GameItemState, UUID> {

}