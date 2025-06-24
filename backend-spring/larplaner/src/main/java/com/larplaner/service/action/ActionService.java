package com.larplaner.service.action;

import java.util.List;
import java.util.UUID;

import com.larplaner.dto.action.ActionRequestDTO;
import com.larplaner.dto.action.ActionResponseDTO;
import com.larplaner.dto.action.UpdateActionRequestDTO;

public interface ActionService {

  List<ActionResponseDTO> getAllActions();

  ActionResponseDTO getActionById(UUID id);

  ActionResponseDTO createAction(ActionRequestDTO actionDTO);

  ActionResponseDTO updateAction(UUID id, UpdateActionRequestDTO actionDTO);

  void deleteAction(UUID id);
}