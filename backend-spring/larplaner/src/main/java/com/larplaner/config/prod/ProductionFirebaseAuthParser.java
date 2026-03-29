package com.larplaner.config.prod;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.larplaner.config.FirebaseAuthParser;
import com.larplaner.security.FirebaseAuthenticationToken;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Profile("!loadtest")
public class ProductionFirebaseAuthParser implements FirebaseAuthParser {

    @Override
    public Authentication getAuthentication(String idToken) throws FirebaseAuthException {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        if (Boolean.TRUE.equals(decodedToken.getClaims().get("isAdmin"))) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }

        return new FirebaseAuthenticationToken(decodedToken, authorities);
    }
}
