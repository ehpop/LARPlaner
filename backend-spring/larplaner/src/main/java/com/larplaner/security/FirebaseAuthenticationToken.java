package com.larplaner.security;

import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 *  Custom wrapper for firebase token
 */
public class FirebaseAuthenticationToken extends AbstractAuthenticationToken {

  private final FirebaseToken principal;

  /**
   * Creates a new, authenticated FirebaseAuthenticationToken.
   * @param principal The full FirebaseToken object.
   * @param authorities The user's authorities/roles.
   */
  public FirebaseAuthenticationToken(FirebaseToken principal, Collection<? extends GrantedAuthority> authorities) {
    super(authorities);
    this.principal = principal;
    setAuthenticated(true);
  }

  @Override
  public Object getCredentials() {
    return null;
  }

  @Override
  public FirebaseToken getPrincipal() {
    return this.principal;
  }

  /**
   * Spring Security will call this method to get the "name" of the user.
   * We explicitly return the UID from our principal object.
   */
  @Override
  public String getName() {
    return this.principal.getUid();
  }
}