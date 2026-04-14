package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.AuthResponse;
import com.busbooking.dto.LoginRequest;
import com.busbooking.dto.RegisterRequest;
import com.busbooking.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication endpoints.
 * Base path: /api/v1/auth  (public — no JWT required)
 * Owner: Backend-1
 *
 * Endpoints:
 *   POST /register  – Register a new user
 *   POST /login     – Authenticate and receive JWT
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register and login endpoints")
public class AuthController {

    private final AuthService authService;

    // -------------------- Register --------------------

    /**
     * POST /api/v1/auth/register
     *
     * Request body:
     * {
     *   "name": "Kuzhalini",
     *   "email": "kuzha@gmail.com",
     *   "password": "pass123"
     * }
     *
     * Response 201:
     * {
     *   "message": "User registered successfully"
     * }
     */
    @Operation(summary = "Register a new user")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Register request received for email: {}", request.getEmail());
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("User registered successfully"));
    }

    // -------------------- Login --------------------

    /**
     * POST /api/v1/auth/login
     *
     * Request body:
     * {
     *   "email": "kuzha@gmail.com",
     *   "password": "pass123"
     * }
     *
     * Response 200:
     * {
     *   "token": "eyJhbGciOiJIUzI1NiJ9...",
     *   "userId": 1,
     *   "email": "kuzha@gmail.com",
     *   "role": "USER"
     * }
     */
    @Operation(summary = "Authenticate user and receive JWT token")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
