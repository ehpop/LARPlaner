package com.larplaner.config.loadtest;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // Run before EVERYTHING else
public class RenderDebugFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("====== RENDER DEBUG ======");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Origin Header: " + request.getHeader("Origin"));
        System.out.println("Auth Header: " + request.getHeader("Authorization"));
        System.out.println("X-Mock-Auth: " + request.getHeader("X-Mock-Auth"));

        // Let the request continue through the security chain
        filterChain.doFilter(request, response);

        // See what happened AFTER your FirebaseFilter ran
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Is Authenticated? " + (auth != null && auth.isAuthenticated()));
        if (auth != null) {
            System.out.println("Granted Authorities: " + auth.getAuthorities());
        }
        System.out.println("Final Response Status: " + response.getStatus());
        System.out.println("==========================");
    }
}
