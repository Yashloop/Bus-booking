package com.busbooking.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Centralized exception handler — provides consistent error response format:
 * {
 *   "timestamp": "...",
 *   "status": 4xx,
 *   "message": "..."
 * }
 * Owner: Backend-1
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // -------------------- Validation errors --------------------

    /**
     * Handles @Valid / @Validated bean validation failures.
     * Returns 400 with field-level error messages.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> body = buildBody(HttpStatus.BAD_REQUEST.value(),
                "Validation failed: " + fieldErrors);

        log.warn("Validation error: {}", fieldErrors);
        return ResponseEntity.badRequest().body(body);
    }

    // -------------------- Auth errors --------------------

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        log.warn("Login failed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(buildBody(HttpStatus.UNAUTHORIZED.value(), "Invalid email or password"));
    }

    // -------------------- Conflict errors --------------------

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleAlreadyExists(
            ResourceAlreadyExistsException ex) {
        log.warn("Resource conflict: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(buildBody(HttpStatus.CONFLICT.value(), ex.getMessage()));
    }

    // -------------------- Resource not found --------------------

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(buildBody(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
    }

    // -------------------- Generic fallback --------------------

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildBody(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        "An unexpected error occurred. Please try again."));
    }

    // -------------------- Helper --------------------

    private Map<String, Object> buildBody(int status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status);
        body.put("message", message);
        return body;
    }
}
