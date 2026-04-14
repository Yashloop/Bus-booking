package com.busbooking.exception;

/**
 * Thrown when a resource (e.g. email) already exists in the system.
 * Maps to HTTP 409 Conflict via GlobalExceptionHandler.
 * Owner: Backend-1
 */
public class ResourceAlreadyExistsException extends RuntimeException {
    public ResourceAlreadyExistsException(String message) {
        super(message);
    }
}
