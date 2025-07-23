package com.larplaner.api.admin.controller;

import com.larplaner.api.admin.AdminUserController;
import com.larplaner.service.admin.firebase.UserLookupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/users")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminUserControllerImpl implements AdminUserController {

  private final UserLookupService userLookupService;

  @Override
  public ResponseEntity<List<String>> getAllUserEmails() {
    List<String> emails = userLookupService.getAllUserEmails();
    return ResponseEntity.ok(emails);
  }
}