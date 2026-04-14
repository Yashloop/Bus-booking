package com.busbooking.exception;

/**
 * Thrown when a requested resource is not found.
 * Maps to HTTP 404 Not Found via GlobalExceptionHandler.
 * Owner: Backend-1 (also used by Backend-2)
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
