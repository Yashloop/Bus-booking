package com.busbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Response payload returned after a successful login.
 * Contains the JWT token and basic user info.
 * Owner: Backend-1
 */
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String email;
    private String role;
}
