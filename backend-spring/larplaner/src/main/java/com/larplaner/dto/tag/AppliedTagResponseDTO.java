package com.larplaner.dto.tag;

import com.larplaner.dto.BaseResponseDTO;
import java.time.ZonedDateTime;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@SuperBuilder
public class AppliedTagResponseDTO extends BaseResponseDTO {

  private TagResponseDTO tag;
  private String userID;
  private String userEmail;
  private ZonedDateTime appliedToUserAt;

}
