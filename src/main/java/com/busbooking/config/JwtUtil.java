package com.busbooking.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Utility component for generating and validating JWT tokens.
 * Owner: Backend-1
 *
 * Configuration keys (application.properties):
 *   jwt.secret   – Base64-encoded 256-bit secret
 *   jwt.expiration – Token validity in milliseconds (default: 86400000 = 24h)
 */
@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    // -------------------- Key builder --------------------

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // -------------------- Token generation --------------------

    /**
     * Generates a signed JWT token with the user email as the subject.
     *
     * @param email the authenticated user's email (used as principal identifier)
     * @return compact JWT string
     */
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey())
                .compact();
    }

    // -------------------- Token parsing --------------------

    /**
     * Extracts the email (subject) from a valid JWT token.
     *
     * @param token the raw JWT string
     * @return the subject (email) embedded in the token
     */
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Validates the token signature and expiry.
     *
     * @param token the raw JWT string
     * @return true if token is valid and not expired
     */
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT token expired: {}", e.getMessage());
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
        }
        return false;
    }

    // -------------------- Private helpers --------------------

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
