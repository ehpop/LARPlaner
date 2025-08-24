package com.larplaner.api.admin;

import com.google.firebase.auth.UserInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "Admin Users Management", description = "Endpoint for admin to manage firebase users")
@SecurityRequirement(name = "bearer-key")
public interface AdminUserController {

  @Operation(summary = "Get all emails of users registered in app")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved all emails")
  })
  @GetMapping("/emails")
  ResponseEntity<List<String>> getAllUserEmails();

  @Operation(summary = "Get user info for uid of user registered in app")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved user info")
  })
  @GetMapping("/{uid}")
  ResponseEntity<UserInfo> getUserInfoById(@PathVariable String uid);
}
