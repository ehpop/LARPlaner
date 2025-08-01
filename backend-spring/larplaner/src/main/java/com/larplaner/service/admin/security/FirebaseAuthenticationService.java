package com.larplaner.service.admin.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.larplaner.security.FirebaseAuthenticationToken;
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class FirebaseAuthenticationService {

  /**
   * Parses a Firebase ID token and returns a Spring Security Authentication object.
   *
   * @param idToken The raw Firebase ID token.
   * @return A populated FirebaseAuthenticationToken.
   * @throws FirebaseAuthException if the token is invalid.
   */
  public static Authentication getAuthentication(String idToken) throws FirebaseAuthException {
    FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);

    List<GrantedAuthority> authorities = new ArrayList<>();
    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
    if (Boolean.TRUE.equals(decodedToken.getClaims().get("isAdmin"))) {
      authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }

    return new FirebaseAuthenticationToken(decodedToken, authorities);
  }
}