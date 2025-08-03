package com.larplaner.dto.role;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class RoleDetailedResponseDTO extends BaseResponseDTO {

  private String name;
  private String description;
  private List<TagResponseDTO> tags;
}