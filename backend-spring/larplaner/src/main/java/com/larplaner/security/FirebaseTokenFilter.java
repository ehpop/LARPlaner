package com.larplaner.security;

import com.google.firebase.auth.FirebaseAuthException;
import com.larplaner.service.admin.security.FirebaseAuthenticationService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
@RequiredArgsConstructor
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
      Authentication authentication = FirebaseAuthenticationService.getAuthentication(idToken);
      SecurityContextHolder.getContext().setAuthentication(authentication);
    } catch (FirebaseAuthException e) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.getWriter().write("Invalid or expired token: " + e.getMessage());
      return;
    }

    filterChain.doFilter(request, response);
  }
}

