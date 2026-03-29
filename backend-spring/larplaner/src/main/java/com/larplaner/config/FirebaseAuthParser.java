package com.larplaner.config;

import org.springframework.security.core.Authentication;

public interface FirebaseAuthParser {
    Authentication getAuthentication(String idToken) throws Exception;
}
