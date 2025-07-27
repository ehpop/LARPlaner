package com.larplaner.repository.event;

import com.larplaner.model.event.EventStatusEnum;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.larplaner.model.event.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

  Optional<Event> findByScenarioId(UUID id);

  List<Event> findAllByAssignedRoles_AssignedEmail(String email);

  List<Event> findAllByScenario_IdAndStatus(UUID scenarioId, EventStatusEnum status);
}