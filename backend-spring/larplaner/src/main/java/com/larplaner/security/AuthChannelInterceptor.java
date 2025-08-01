package com.larplaner.security;

import com.larplaner.service.admin.security.FirebaseAuthenticationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@Slf4j
/**
 * Custom Channel Interceptor for validating Web Socket requests over STOMP protocol
 */
public class AuthChannelInterceptor implements ChannelInterceptor {

  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {
    final StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message,
        StompHeaderAccessor.class);

    if (accessor == null) {
      throw new BadCredentialsException("Accessor header was not found!");
    }

    if (StompCommand.CONNECT.equals(accessor.getCommand())) {
      String authHeader = accessor.getFirstNativeHeader("Authorization");

      if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String idToken = authHeader.substring(7);
        try {
          Authentication authentication = FirebaseAuthenticationService.getAuthentication(idToken);
          accessor.setUser(authentication);
        } catch (Exception e) {
          throw new BadCredentialsException(
              "Invalid or malformed token provided for STOMP connection.", e);
        }
      } else {
        throw new BadCredentialsException("Missing Authorization header for STOMP connection.");
      }
    }
    return message;
  }
}