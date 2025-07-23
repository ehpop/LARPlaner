package com.larplaner.config;

import static org.springframework.boot.autoconfigure.security.servlet.PathRequest.toH2Console;

import com.larplaner.security.FirebaseTokenFilter;
import java.util.Arrays;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Slf4j
public class SecurityConfig {

  @Bean
  public FirebaseTokenFilter firebaseTokenFilter() {
    return new FirebaseTokenFilter();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        // Disable CSRF for stateless APIs
        .csrf(AbstractHttpConfigurer::disable)
        // Configure CORS
        .cors(customizer -> customizer.configurationSource(corsConfigurationSource()))
        // Make session management stateless
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        // Apply authorization rules
        .authorizeHttpRequests(auth -> auth
            // --- Public endpoints ---
            .requestMatchers(toH2Console()).permitAll()
            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

            // --- API Authorization Rules ---
            .requestMatchers( "/api/**").authenticated()

            // Fallback: any other request must be authenticated
            .anyRequest().authenticated()
        )
        // Allow frames for H2 console
        .headers(headers -> headers.frameOptions(FrameOptionsConfig::sameOrigin))
        .addFilterBefore(firebaseTokenFilter(), UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    configuration.setAllowedOrigins(List.of("http://localhost:9000"));

    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));

    configuration.setAllowCredentials(true);

    // configuration.setExposedHeaders(List.of("Authorization"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration); // Apply this configuration to all endpoints

    return source;
  }
}