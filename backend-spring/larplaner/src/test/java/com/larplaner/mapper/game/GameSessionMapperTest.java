package com.larplaner.mapper.game;

import static org.assertj.core.api.Assertions.assertThat;

import com.larplaner.dto.game.GameSessionDetailedResponseDTO;
import com.larplaner.dto.game.GameSessionSummaryResponseDTO;
import com.larplaner.mapper.game.item.GameItemStateMapper;
import com.larplaner.mapper.game.role.GameRoleStateMapper;
import com.larplaner.model.event.Event;
import com.larplaner.model.game.GameSession;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GameSessionMapperTest {

  @Mock
  private GameRoleStateMapper gameRoleStateMapper;
  @Mock
  private GameItemStateMapper gameItemStateMapper;

  @InjectMocks
  private GameSessionMapper gameSessionMapper;

  @Nested
  @DisplayName("toDetailedDTO")
  class ToDetailedDTO {

    @Test
    @DisplayName("Should map GameSession to detailed DTO with eventId")
    void givenGameSessionWithEvent_whenToDetailedDTO_thenMapsAllFields() {
      // given
      Event event = Event.builder().name("Event").build();
      GameSession gameSession = GameSession.builder()
          .event(event)
          .startTime(ZonedDateTime.now())
          .endTime(ZonedDateTime.now().plusHours(2))
          .assignedRoles(new ArrayList<>())
          .items(new ArrayList<>())
          .build();

      // when
      GameSessionDetailedResponseDTO result = gameSessionMapper.toDetailedDTO(gameSession);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(gameSession.getId());
      assertThat(result.getEventId()).isEqualTo(event.getId());
      assertThat(result.getStartTime()).isEqualTo(gameSession.getStartTime());
      assertThat(result.getEndTime()).isEqualTo(gameSession.getEndTime());
      assertThat(result.getAssignedRoles()).isEmpty();
      assertThat(result.getItems()).isEmpty();
    }

    @Test
    @DisplayName("Should return null when input is null")
    void givenNull_whenToDetailedDTO_thenReturnsNull() {
      assertThat(gameSessionMapper.toDetailedDTO(null)).isNull();
    }
  }

  @Nested
  @DisplayName("toDTO (summary)")
  class ToDTO {

    @Test
    @DisplayName("Should map GameSession to summary DTO")
    void givenGameSession_whenToDTO_thenMapsSummary() {
      // given
      Event event = Event.builder().name("Event").build();
      GameSession gameSession = GameSession.builder()
          .event(event)
          .startTime(ZonedDateTime.now())
          .endTime(ZonedDateTime.now().plusHours(3))
          .build();

      // when
      GameSessionSummaryResponseDTO result = gameSessionMapper.toDTO(gameSession);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(gameSession.getId());
      assertThat(result.getEventId()).isEqualTo(event.getId());
      assertThat(result.getStartTime()).isEqualTo(gameSession.getStartTime());
    }

    @Test
    @DisplayName("Should return null when input is null")
    void givenNull_whenToDTO_thenReturnsNull() {
      assertThat(gameSessionMapper.toDTO(null)).isNull();
    }
  }
}
