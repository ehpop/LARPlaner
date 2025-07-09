package com.larplaner.config;

import static org.springframework.boot.autoconfigure.security.servlet.PathRequest.toH2Console;

import java.util.Arrays;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    log.info("This main config should be used");

    http
        .cors(customizer -> customizer.configurationSource(corsConfigurationSource()))
        // Apply authorization rules
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(toH2Console()).permitAll() // Allow H2 console access
            // Swagger UI endpoints
            .requestMatchers("/swagger-ui/**").permitAll()
            .requestMatchers("/v3/api-docs/**").permitAll()
            .requestMatchers("/swagger-ui.html").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/**").permitAll()
            .requestMatchers(HttpMethod.PUT, "/api/**").permitAll()
            .requestMatchers(HttpMethod.DELETE, "/api/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
            .anyRequest().authenticated())
        // Allow frames for H2 console
        .headers(headers -> headers.frameOptions(FrameOptionsConfig::sameOrigin))
        // Disable CSRF
        .csrf(csrf -> csrf
                .ignoringRequestMatchers(toH2Console())
                .ignoringRequestMatchers("/swagger-ui/**", "/v3/api-docs/**")
                .ignoringRequestMatchers("/api/**") // Disable CSRF for all API
            // endpoints during development
        );

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