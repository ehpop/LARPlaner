package com.larplaner.config.loadtest;

import com.google.firebase.auth.FirebaseToken;
import com.larplaner.config.FirebaseAuthParser;
import com.larplaner.security.FirebaseAuthenticationToken;
import lombok.extern.slf4j.Slf4j;
import org.mockito.Mockito;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@Profile("loadtest")
public class LoadtestFirebaseAuthParser implements FirebaseAuthParser {

    @Override
    public Authentication getAuthentication(String idToken) {
        FirebaseToken mockToken = Mockito.mock(FirebaseToken.class);
        Mockito.when(mockToken.getUid()).thenReturn(idToken);
        Mockito.when(mockToken.getEmail()).thenReturn(idToken + "@loadtest.local");

        Map<String, Object> claims = new HashMap<>();
        if (idToken.contains("admin")) {
            claims.put("isAdmin", true);
        }
        Mockito.when(mockToken.getClaims()).thenReturn(claims);

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        if (Boolean.TRUE.equals(claims.get("isAdmin"))) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }

        return new FirebaseAuthenticationToken(mockToken, authorities);
    }
}
