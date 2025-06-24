package com.larplaner.repository.scenario;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.larplaner.model.scenario.ScenarioRole;

public interface ScenarioRoleRepository extends JpaRepository<ScenarioRole, UUID> {

  Optional<ScenarioRole> findByRoleId(UUID roleId);

}
