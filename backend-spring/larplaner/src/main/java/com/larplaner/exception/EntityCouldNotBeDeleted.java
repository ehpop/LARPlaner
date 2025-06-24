package com.larplaner.exception;


public class EntityCouldNotBeDeleted extends RuntimeException {

  public EntityCouldNotBeDeleted(String message) {
    super(message);
  }
}
