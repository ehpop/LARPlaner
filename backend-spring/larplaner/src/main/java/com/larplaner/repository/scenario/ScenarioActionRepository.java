package com.larplaner.repository.scenario;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.larplaner.model.scenario.ScenarioAction;

public interface ScenarioActionRepository extends JpaRepository<ScenarioAction, UUID> {

}
