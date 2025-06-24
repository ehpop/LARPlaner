package com.larplaner.api.tag;

import com.larplaner.dto.tag.TagRequestDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import com.larplaner.dto.tag.UpdateTagRequestDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Tag", description = "Tag management APIs")
public interface TagController {

  @Operation(summary = "Get all tags")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved all tags")
  })
  @GetMapping
  ResponseEntity<List<TagResponseDTO>> getAllTags(
      @RequestParam(name = "search", required = false) String searchTerm
  );

  @Operation(summary = "Get tag by ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved tag"),
      @ApiResponse(responseCode = "404", description = "Tag not found")
  })
  @GetMapping("/{id}")
  ResponseEntity<TagResponseDTO> getTagById(
      @Parameter(description = "ID of the tag to retrieve") @PathVariable UUID id);

  @Operation(summary = "Create new tags")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "Tags created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid input")
  })
  @PostMapping
  ResponseEntity<List<TagResponseDTO>> createTags(
      @Parameter(description = "List of Tags to create") @RequestBody @Valid List<TagRequestDTO> tagRequestDTOList);

  @Operation(summary = "Update an existing tag")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Tag updated successfully"),
      @ApiResponse(responseCode = "404", description = "Tag not found"),
      @ApiResponse(responseCode = "400", description = "Invalid input")
  })
  @PutMapping("/{id}")
  ResponseEntity<TagResponseDTO> updateTag(
      @Parameter(description = "ID of the tag to update") @PathVariable UUID id,
      @Parameter(description = "Updated tag data") @RequestBody @Valid UpdateTagRequestDTO updateTagRequestDTO);

  @Operation(summary = "Delete a tag")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "Tag deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Tag not found")
  })
  @DeleteMapping("/{id}")
  ResponseEntity<Void> deleteTag(
      @Parameter(description = "ID of the tag to delete") @PathVariable UUID id);
}