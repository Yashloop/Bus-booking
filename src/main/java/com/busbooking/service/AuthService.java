package com.busbooking.service;

import com.busbooking.config.JwtUtil;
import com.busbooking.dto.AuthResponse;
import com.busbooking.dto.LoginRequest;
import com.busbooking.dto.RegisterRequest;
import com.busbooking.entity.User;
import com.busbooking.exception.ResourceAlreadyExistsException;
import com.busbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Authentication service — handles registration and login business logic.
 * Owner: Backend-1
 *
 * Logging:
 *   - INFO on successful register / login
 *   - WARN on duplicate registration attempt
 *   - ERROR on unexpected failures propagated upward
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // -------------------- Register --------------------

    /**
     * Registers a new user.
     * Throws {@link ResourceAlreadyExistsException} if the email is already taken.
     *
     * @param request validated registration payload
     */
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration attempt with already-existing email: {}", request.getEmail());
            throw new ResourceAlreadyExistsException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        userRepository.save(user);
        log.info("New user registered: {}", request.getEmail());
    }

    // -------------------- Login --------------------

    /**
     * Authenticates a user and returns a JWT token.
     * Spring Security's AuthenticationManager handles bad-credentials validation.
     *
     * @param request login credentials
     * @return {@link AuthResponse} with JWT token and user details
     */
    public AuthResponse login(LoginRequest request) {
        // Delegates to DaoAuthenticationProvider — throws BadCredentialsException on failure
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        String token = jwtUtil.generateToken(user.getEmail());
        log.info("User logged in: {}", user.getEmail());

        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole());
    }
}
