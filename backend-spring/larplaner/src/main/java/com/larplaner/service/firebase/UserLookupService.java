package com.larplaner.service.firebase;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.larplaner.exception.firebase.UserEmailWasNotRegistered;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserLookupService {

  public Map<String, String> getUserIDsByEmails(List<String> emails) {
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
}
