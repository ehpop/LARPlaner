package com.larplaner.api.scenario.controller; // Adjust package as needed

import static com.larplaner.api.common.TestConstants.ITEM_ACTION_ID_READ_DIARY;
import static com.larplaner.api.common.TestConstants.ITEM_ID_MUDDY_BOOTS;
import static com.larplaner.api.common.TestConstants.ITEM_ID_VICTIMS_DIARY;
import static com.larplaner.api.common.TestConstants.ROLE_ID_DETECTIVE;
import static com.larplaner.api.common.TestConstants.ROLE_ID_SUSPECT;
import static com.larplaner.api.common.TestConstants.ROLE_ID_WITNESS;
import static com.larplaner.api.common.TestConstants.SCENARIO_ACTION_ID_INTERROGATE;
import static com.larplaner.api.common.TestConstants.SCENARIO_ID_MIDNIGHT_MYSTERY;
import static com.larplaner.api.common.TestConstants.SCENARIO_ROLE_ID_DETECTIVE_LINK;
import static com.larplaner.api.common.TestConstants.SCENARIO_ROLE_ID_SUSPECT_LINK;
import static com.larplaner.api.common.TestConstants.SCENARIO_ROLE_ID_WITNESS_LINK;
import static com.larplaner.api.common.TestConstants.TAG_ID_CLUE_BOOTS_MATCH_SUSPECT;
import static com.larplaner.api.common.TestConstants.TAG_ID_CLUE_SECRET_COMPARTMENT;
import static com.larplaner.api.common.TestConstants.TAG_ID_ROLE_DETECTIVE;
import static com.larplaner.api.common.TestConstants.TAG_ID_SKILL_DEDUCTION;
import static com.larplaner.api.common.TestConstants.TAG_ID_SKILL_OBSERVATION;
import static com.larplaner.api.common.TestConstants.TAG_ID_SUSPECT_CONTRADICTION;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.larplaner.api.common.BaseTestClass;
import com.larplaner.dto.scenario.ScenarioRequestDTO;
import com.larplaner.dto.scenario.ScenarioResponseDTO;
import com.larplaner.dto.scenario.action.ScenarioActionRequestDTO;
import com.larplaner.dto.scenario.action.ScenarioActionResponseDTO;
import com.larplaner.dto.scenario.item.ScenarioItemRequestDTO;
import com.larplaner.dto.scenario.item.ScenarioItemResponseDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionRequestDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionResponseDTO;
import com.larplaner.dto.scenario.role.ScenarioRoleRequestDTO;
import com.larplaner.dto.scenario.role.ScenarioRoleResponseDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import com.larplaner.service.scenario.ScenarioService;

@WebMvcTest(ScenarioControllerImpl.class) // Assuming ScenarioControllerImpl is your controller
public class ScenarioControllerTest extends BaseTestClass {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ScenarioService scenarioService; // Mock the ScenarioService

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/scenarios should create 'The Midnight Mansion Mystery' scenario")
    void createScenario_MidnightMansionMystery_shouldReturnCreatedScenario() throws Exception {
        // Arrange (Request DTO)
        ScenarioRequestDTO requestDTO = ScenarioRequestDTO.builder()
                .name("The Midnight Mansion Mystery")
                .description(
                        "A wealthy recluse is found dead in his locked study. Uncover the truth behind his untimely demise.")
                .roles(List.of(
                        ScenarioRoleRequestDTO.builder()
                                .roleId(ROLE_ID_DETECTIVE)
                                .descriptionForGM(
                                        "The Detective leads the investigation. Give them access to the crime scene first.")
                                .descriptionForOwner(
                                        "You are the Lead Detective. Your goal is to find the culprit and the motive. You can examine clues and interrogate others.")
                                .descriptionForOthers(
                                        "A sharp, determined individual who seems to be in charge of the investigation.")
                                .build(),
                        ScenarioRoleRequestDTO.builder()
                                .roleId(ROLE_ID_WITNESS)
                                .descriptionForGM(
                                        "The Witness is jumpy. They hold a key piece of information (Secret A) but need to be persuaded or feel safe to reveal it.")
                                .descriptionForOwner(
                                        "You saw something on the night of the murder. It's scary, but you feel compelled to help, yet fear the consequences.")
                                .descriptionForOthers(
                                        "A nervous person, constantly looking over their shoulder. They seem to know more than they're letting on.")
                                .build(),
                        ScenarioRoleRequestDTO.builder()
                                .roleId(ROLE_ID_SUSPECT)
                                .descriptionForGM(
                                        "The Suspect is the prime candidate. They had a strong motive (Motive X). They will try to mislead the Detective.")
                                .descriptionForOwner(
                                        "You are being framed, or perhaps you are guilty. Either way, you must convince everyone of your innocence or deflect suspicion.")
                                .descriptionForOthers(
                                        "This person looks guilty, or at least very defensive. They had a known conflict with the deceased.")
                                .build()))
                .items(List.of(
                        ScenarioItemRequestDTO.builder()
                                .name("Victim's Diary")
                                .description(
                                        "A leather-bound diary found on the victim's desk. The last few entries are hurried and cryptic.")
                                .actions(List.of(
                                        ScenarioItemActionRequestDTO.builder()
                                                .name("Read Diary")
                                                .description("Attempt to decipher the last entries in the diary.")
                                                .messageOnSuccess(
                                                        "You find a hidden message pointing towards a secret compartment!")
                                                .messageOnFailure(
                                                        "The handwriting is too erratic, or it's written in a code you don't understand yet.")
                                                .requiredTagsToDisplay(Collections.emptyList())
                                                .requiredTagsToSucceed(List.of(TAG_ID_SKILL_OBSERVATION))
                                                .build()))
                                .build(),
                        ScenarioItemRequestDTO.builder()
                                .name("Muddy Boots")
                                .description("A pair of muddy boots found near the back entrance.")
                                .actions(List.of(
                                        ScenarioItemActionRequestDTO.builder()
                                                .name("Examine Boots")
                                                .description(
                                                        "Check the boots for any distinguishing features or clues.")
                                                .messageOnSuccess(
                                                        "The mud seems to be from the old quarry, and the size matches the Suspect!")
                                                .messageOnFailure("They're just muddy boots. Nothing special.")
                                                .requiredTagsToSucceed(
                                                        List.of(TAG_ID_SKILL_DEDUCTION, TAG_ID_SKILL_OBSERVATION))
                                                .build()))
                                .build()))
                .actions(List.of(
                        ScenarioActionRequestDTO.builder()
                                .name("Interrogate Suspect")
                                .description(
                                        "Formally question the Main Suspect about their whereabouts and motive.")
                                .messageOnSuccess(
                                        "The Suspect slips up and reveals a piece of information they shouldn't know!")
                                .messageOnFailure(
                                        "The Suspect maintains their composure and offers a plausible alibi.")
                                .requiredTagsToDisplay(List.of(TAG_ID_ROLE_DETECTIVE))
                                .requiredTagsToSucceed(List.of(TAG_ID_SKILL_DEDUCTION))
                                .build()))
                .build();

        // Arrange (Response DTO)
        ScenarioResponseDTO responseDTO = ScenarioResponseDTO.builder()
                .id(SCENARIO_ID_MIDNIGHT_MYSTERY)
                .name("The Midnight Mansion Mystery")
                .description(
                        "A wealthy recluse is found dead in his locked study. Uncover the truth behind his untimely demise.")
                .roles(List.of(
                        ScenarioRoleResponseDTO.builder().id(SCENARIO_ROLE_ID_DETECTIVE_LINK)
                                .roleId(ROLE_ID_DETECTIVE)
                                .scenarioId(SCENARIO_ID_MIDNIGHT_MYSTERY)
                                .descriptionForOwner("You are the Lead Detective...").build(),
                        ScenarioRoleResponseDTO.builder().id(SCENARIO_ROLE_ID_WITNESS_LINK)
                                .roleId(ROLE_ID_WITNESS)
                                .scenarioId(SCENARIO_ID_MIDNIGHT_MYSTERY)
                                .descriptionForOwner("You saw something...")
                                .build(),
                        ScenarioRoleResponseDTO.builder().id(SCENARIO_ROLE_ID_SUSPECT_LINK)
                                .roleId(ROLE_ID_SUSPECT)
                                .scenarioId(SCENARIO_ID_MIDNIGHT_MYSTERY)
                                .descriptionForOwner("You are being framed...")
                                .build()))
                .items(List.of(
                        ScenarioItemResponseDTO.builder().id(ITEM_ID_VICTIMS_DIARY)
                                .scenarioId(SCENARIO_ID_MIDNIGHT_MYSTERY).name("Victim's Diary")
                                .actions(List.of(
                                        ScenarioItemActionResponseDTO.builder().id(ITEM_ACTION_ID_READ_DIARY)
                                                .name("Read Diary")
                                                .tagsToApplyOnSuccess(List
                                                        .of(TagResponseDTO.builder().id(TAG_ID_CLUE_SECRET_COMPARTMENT)
                                                                .value("Clue_SecretCompartment").build()))
                                                .build()))
                                .build(),
                        ScenarioItemResponseDTO.builder().id(ITEM_ID_MUDDY_BOOTS)
                                .scenarioId(SCENARIO_ID_MIDNIGHT_MYSTERY).name("Muddy Boots")
                                .actions(List.of(ScenarioItemActionResponseDTO.builder().name("Examine Boots")
                                        .tagsToApplyOnSuccess(
                                                List.of(TagResponseDTO.builder().id(TAG_ID_CLUE_BOOTS_MATCH_SUSPECT)
                                                        .value("Clue_BootsMatchSuspect").build()))
                                        .build()))
                                .build()))
                .actions(List.of(
                        ScenarioActionResponseDTO.builder().id(SCENARIO_ACTION_ID_INTERROGATE)
                                .scenarioId(SCENARIO_ID_MIDNIGHT_MYSTERY).name("Interrogate Suspect")
                                .tagsToApplyOnSuccess(
                                        List.of(TagResponseDTO.builder().id(TAG_ID_SUSPECT_CONTRADICTION)
                                                .value("Suspect_Contradiction").build()))
                                .build()))
                .build();
        when(scenarioService.createScenario(any(ScenarioRequestDTO.class))).thenReturn(responseDTO);

        // Act & Assert
        mockMvc.perform(post("/api/scenarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(SCENARIO_ID_MIDNIGHT_MYSTERY.toString()))
                .andExpect(jsonPath("$.name").value("The Midnight Mansion Mystery"))
                .andExpect(jsonPath("$.roles.length()").value(3))
                .andExpect(jsonPath("$.roles[0].roleId").value(ROLE_ID_DETECTIVE.toString()))
                .andExpect(jsonPath("$.items.length()").value(2))
                .andExpect(jsonPath("$.items[0].name").value("Victim's Diary"))
                .andExpect(jsonPath("$.actions.length()").value(1))
                .andExpect(jsonPath("$.tags.length()").value(2));

        verify(scenarioService, times(1)).createScenario(any(ScenarioRequestDTO.class));
    }
}