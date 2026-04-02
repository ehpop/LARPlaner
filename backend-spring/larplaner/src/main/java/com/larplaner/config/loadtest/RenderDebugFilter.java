package com.larplaner.config.loadtest;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // Run before EVERYTHING else
public class RenderDebugFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        log.warn("====== RENDER DEBUG ======");
        log.warn("Request URI: " + request.getRequestURI());
        log.warn("Origin Header: " + request.getHeader("Origin"));
        log.warn("Auth Header: " + request.getHeader("Authorization"));
        log.warn("X-Mock-Auth: " + request.getHeader("X-Mock-Auth"));

        // Let the request continue through the security chain
        filterChain.doFilter(request, response);

        // See what happened AFTER your FirebaseFilter ran
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.warn("Is Authenticated? " + (auth != null && auth.isAuthenticated()));
        if (auth != null) {
            log.warn("Granted Authorities: " + auth.getAuthorities());
        }
        log.warn("Final Response Status: " + response.getStatus());
        log.warn("==========================");
    }
}
