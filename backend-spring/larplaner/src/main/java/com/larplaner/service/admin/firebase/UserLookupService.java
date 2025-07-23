package com.larplaner.service.admin.firebase;

import com.google.firebase.auth.ExportedUserRecord;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.ListUsersPage;
import com.google.firebase.auth.UserRecord;
import com.larplaner.exception.firebase.UserEmailWasNotRegistered;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserLookupService {

  public Map<String, String> getUserIDsByEmails(Collection<String> emails) {
    Map<String, String> emailToUidMap = new HashMap<>();

    for (String email : emails) {
      try {
        emailToUidMap.put(email, getUserIDByEmail(email));
      } catch (Exception e) {
        emailToUidMap.put(email, "");
      }
    }

    return emailToUidMap;
  }

  public String getUserIDByEmail(String email) {
    FirebaseAuth auth = FirebaseAuth.getInstance();
    try {
      UserRecord userRecord = auth.getUserByEmail(email);
      log.debug("Found UID for email {}: {}", email, userRecord.getUid());

      return userRecord.getUid();
    } catch (FirebaseAuthException e) {
      if (e.getErrorCode().name().equals("auth/user-not-found")) {
        log.error("No user found for email: {}", email);
        throw new UserEmailWasNotRegistered("No user found for email: " + email);
      } else {
        log.error("Error fetching user by email {}: {}", email, e.getMessage());
        throw new RuntimeException(
            String.format("Error fetching user by email %s: %s", email, e.getMessage()));
      }
    }
  }

  /**
   * Retrieves a list of all user emails from Firebase Authentication.
   * This method handles pagination automatically.
   *
   * @return A list of user emails.
   * @throws RuntimeException if there is an error communicating with Firebase.
   */
  public List<String> getAllUserEmails() {
    log.info("Fetching all user emails from Firebase...");
    try {
      // listUsersAsync() returns an ApiFuture, which we can get() to block
      // and wait for the result. iterateAll() handles fetching all pages.
      FirebaseAuth firebaseAuth = FirebaseAuth.getInstance();
      ListUsersPage page = firebaseAuth.listUsers(null);
      Iterable<ExportedUserRecord> userRecords = page.iterateAll();

      // Use Java Streams to map UserRecord to email and collect to a list
      List<String> emails = StreamSupport.stream(userRecords.spliterator(), false)
          .map(UserRecord::getEmail)
          .collect(Collectors.toList());

      log.info("Successfully fetched {} user emails.", emails.size());
      return emails;

    } catch (FirebaseAuthException e) {
      log.error("Error listing users from Firebase", e);
      throw new RuntimeException("Failed to retrieve users from Firebase.", e);
    }
  }
}
