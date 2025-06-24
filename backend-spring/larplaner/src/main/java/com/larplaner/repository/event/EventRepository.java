package com.larplaner.repository.event;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.larplaner.model.event.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

  Optional<Event> findByScenarioId(UUID id);
}