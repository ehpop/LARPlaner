package com.larplaner.mapper.event;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.larplaner.dto.event.EventRequestDTO;
import com.larplaner.dto.event.EventResponseDTO;
import com.larplaner.dto.event.EventUpdateRequestDTO;
import com.larplaner.mapper.game.GameSessionMapper;
import com.larplaner.mapper.scenario.ScenarioMapper;
import com.larplaner.model.event.Event;
import com.larplaner.repository.scenario.ScenarioRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EventMapper {

  private final ScenarioMapper scenarioMapper;
  private final GameSessionMapper gameSessionMapper;
  private final AssignedRoleMapper assignedRoleMapper;
  private final ScenarioRepository scenarioRepository;

  /**
   * Assigned Roles should be set in service layer.
   * 
   * @param event - Event
   * @return - EventResponseDTO
   */
  public EventResponseDTO toDTO(Event event) {
    return EventResponseDTO.builder()
        .id(event.getId())
        .name(event.getName())
        .description(event.getDescription())
        .img(event.getImg())
        .status(event.getStatus().name())
        .date(event.getDate())
        .scenarioId(event.getScenario().getId())
        .gameSession(gameSessionMapper.toDTO(event.getGameSession()))
        .assignedRoles(event.getAssignedRoles() != null ? event.getAssignedRoles().stream()
            .map(assignedRoleMapper::toDTO)
            .collect(Collectors.toList()) : null)
        .build();
  }

  /**
   * Assigned Roles should be set in service layer.
   *
   * @param dto - EventRequestDTO
   * @return - Event
   */
  public Event toEntity(EventRequestDTO dto) {
    return Event.builder()
        .name(dto.getName())
        .description(dto.getDescription())
        .img(dto.getImg())
        .date(dto.getDate())
        .scenario(scenarioRepository.getReferenceById(dto.getScenarioId()))
        .build();
  }

  /**
   * Assigned Roles should be set in service layer.
   * 
   * @param dto    - EventUpdateRequestDTO
   * @param entity - Event
   */
  public void updateEntityFromDTO(EventUpdateRequestDTO dto, Event entity) {
    entity.setName(dto.getName());
    entity.setDescription(dto.getDescription());
    entity.setImg(dto.getImg());
    entity.setDate(dto.getDate());
    entity.setScenario(scenarioRepository.getReferenceById(dto.getScenarioId()));
  }
}