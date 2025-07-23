package com.larplaner.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
public class FirebaseTokenFilter extends OncePerRequestFilter {

  public static final String BEARER_TOKEN = "Bearer ";

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    String header = request.getHeader("Authorization");

    if (header == null || !header.startsWith(BEARER_TOKEN)) {
      filterChain.doFilter(request, response);
      return;
    }

    String idToken = header.substring(BEARER_TOKEN.length());

    try {
      FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);

      List<GrantedAuthority> authorities = new ArrayList<>();
      authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

      if (Boolean.TRUE.equals(decodedToken.getClaims().get("isAdmin"))) {
        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
      }

      log.debug("Granted authorities = {}", authorities);

      UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
          decodedToken, null, authorities);

      SecurityContextHolder.getContext().setAuthentication(authentication);
    } catch (FirebaseAuthException e) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.getWriter().write("Invalid or expired token: " + e.getMessage());
      return;
    }

    filterChain.doFilter(request, response);
  }
}

