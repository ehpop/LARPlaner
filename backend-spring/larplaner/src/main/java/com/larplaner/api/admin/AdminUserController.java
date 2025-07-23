package com.larplaner.api.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@Tag(name = "Admin Users Management", description = "Endpoint for admin to manage firebase users")
@SecurityRequirement(name = "bearer-key")
public interface AdminUserController {

  @Operation(summary = "Get all emails of users registered in app")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved all emails")
  })
  @GetMapping("/emails")
  ResponseEntity<List<String>> getAllUserEmails();
}
