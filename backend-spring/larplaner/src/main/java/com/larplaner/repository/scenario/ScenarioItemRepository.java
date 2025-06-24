package com.larplaner.repository.scenario;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.larplaner.model.scenario.ScenarioItem;

public interface ScenarioItemRepository extends JpaRepository<ScenarioItem, UUID> {

}
