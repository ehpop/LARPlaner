package com.larplaner.exception.firebase;

public class UserEmailWasNotRegistered extends RuntimeException {

  public UserEmailWasNotRegistered(String message) {
    super(message);
  }
}
