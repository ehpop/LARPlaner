package com.larplaner.mapper.tag;

import com.larplaner.dto.tag.AppliedTagResponseDTO;
import com.larplaner.model.tag.AppliedTag;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AppliedTagMapper {

  private final TagMapper tagMapper;

  public AppliedTagResponseDTO toDTO(AppliedTag appliedTag) {
    return AppliedTagResponseDTO.builder()
        .id(appliedTag.getId())
        .appliedToUserAt(appliedTag.getAppliedToUserAt())
        .userID(appliedTag.getUserID())
        .userEmail(appliedTag.getUserEmail())
        .tag(tagMapper.toDTO(appliedTag.getTag()))
        .build();
  }
}
