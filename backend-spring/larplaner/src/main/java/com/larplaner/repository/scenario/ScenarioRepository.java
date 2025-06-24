package com.larplaner.repository.scenario;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.larplaner.model.scenario.Scenario;

@Repository
public interface ScenarioRepository extends JpaRepository<Scenario, UUID> {

}