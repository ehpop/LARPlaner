package com.larplaner.exception;

import com.larplaner.exception.event.status.EventStatusCouldNotBeChanged;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice("com.larplaner.api")
@Slf4j
public class GlobalRestExceptionHandler {

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleEntityNotFoundException(
      EntityNotFoundException ex, HttpServletRequest request) {

    log.error("EntityNotFoundException: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse(
        HttpStatus.NOT_FOUND.value(),
        "Not Found",
        ex.getMessage(),
        request.getRequestURI()
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGenericException(
      Exception ex, HttpServletRequest request) {

    log.error("An unexpected error occurred: {}", ex.getMessage(), ex);

    ErrorResponse errorResponse = new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        "Internal Server Error",
        "An unexpected error occurred. Please try again later or contact administrator.",
        request.getRequestURI()
    );

    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ErrorResponse> handleGenericRuntimeException(
      RuntimeException ex, HttpServletRequest request) {

    log.error("An unexpected error occurred: {}", ex.getMessage(), ex);

    ErrorResponse errorResponse = new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        "Internal Server Error",
        "An unexpected error occurred. Please try again later or contact administrator.",
        request.getRequestURI()
    );

    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
      IllegalArgumentException ex, HttpServletRequest request) {

    log.warn("IllegalArgumentException: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        ex.getMessage(),
        request.getRequestURI()
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(EntityCouldNotBeDeleted.class)
  public ResponseEntity<ErrorResponse> handleEntityCouldNotBeDeleted(
      EntityCouldNotBeDeleted ex, HttpServletRequest request) {

    log.warn("EntityCouldNotBeDeleted: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        ex.getMessage(),
        request.getRequestURI()
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(EntityCouldNotBeAdded.class)
  public ResponseEntity<ErrorResponse> handleEntityCouldNotBeAdded(
      EntityCouldNotBeAdded ex, HttpServletRequest request) {

    log.warn("EntityCouldNotBeAdded: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        ex.getMessage(),
        request.getRequestURI()
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(
      DataIntegrityViolationException ex, HttpServletRequest request) {

    log.warn("DataIntegrityViolationException: {}", ex.getMessage());

    String errorMessage = "The operation could not be completed. " +
        "This record is still referenced by another entity and cannot be deleted.";

    ErrorResponse errorResponse = new ErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        errorMessage,
        request.getRequestURI()
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(EventStatusCouldNotBeChanged.class)
  public ResponseEntity<ErrorResponse> handleEventStatusCouldNotBeChanged(
      EventStatusCouldNotBeChanged ex, HttpServletRequest request) {

    log.warn("EventStatusCouldNotBeChanged: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        ex.getMessage(),
        request.getRequestURI()
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleEventStatusCouldNotBeChanged(
      AccessDeniedException ex, HttpServletRequest request) {

    log.warn("AccessDeniedException: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse(
        HttpStatus.FORBIDDEN.value(),
        "Access denied",
        ex.getMessage(),
        request.getRequestURI()
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }
}