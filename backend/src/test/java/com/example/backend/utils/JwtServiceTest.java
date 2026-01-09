package com.example.backend.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("JwtService Unit Tests")
class JwtServiceTest {

    private JwtService jwtService;
    private UserDetails testUserDetails;
    private final String testSecret = "testSecretKeyThatIsLongEnoughForHS256AlgorithmToWork1234567890";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(testSecret);
        
        testUserDetails = User.builder()
                .username("testuser")
                .password("password")
                .authorities(Collections.emptyList())
                .build();
    }

    @Test
    @DisplayName("Should generate valid JWT token")
    void testGenerateToken() {
        // When
        String token = jwtService.generateToken(testUserDetails);

        // Then
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    @Test
    @DisplayName("Should extract username from token")
    void testExtractUsername() {
        // Given
        String token = jwtService.generateToken(testUserDetails);

        // When
        String username = jwtService.extractUsername(token);

        // Then
        assertEquals("testuser", username);
    }

    @Test
    @DisplayName("Should validate token successfully")
    void testIsTokenValid() {
        // Given
        String token = jwtService.generateToken(testUserDetails);

        // When
        boolean isValid = jwtService.isTokenValid(token, testUserDetails);

        // Then
        assertTrue(isValid);
    }

    @Test
    @DisplayName("Should invalidate token for different user")
    void testIsTokenInvalidForDifferentUser() {
        // Given
        String token = jwtService.generateToken(testUserDetails);
        
        UserDetails differentUser = User.builder()
                .username("differentuser")
                .password("password")
                .authorities(Collections.emptyList())
                .build();

        // When
        boolean isValid = jwtService.isTokenValid(token, differentUser);

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should throw exception for malformed token")
    void testMalformedToken() {
        // Given
        String malformedToken = "not.a.valid.jwt.token";

        // When & Then
        assertThrows(MalformedJwtException.class, () -> {
            jwtService.extractUsername(malformedToken);
        });
    }

    @Test
    @DisplayName("Should throw exception for token with invalid signature")
    void testInvalidSignature() {
        // Given
        String token = jwtService.generateToken(testUserDetails);
        String tamperedToken = token.substring(0, token.length() - 10) + "tampered12";

        // When & Then
        assertThrows(SignatureException.class, () -> {
            jwtService.extractUsername(tamperedToken);
        });
    }

    @Test
    @DisplayName("Should generate different tokens for same user at different times")
    void testDifferentTokensForSameUser() throws InterruptedException {
        // Given
        String token1 = jwtService.generateToken(testUserDetails);
        Thread.sleep(1000); // Wait 1 second
        String token2 = jwtService.generateToken(testUserDetails);

        // Then
        assertNotEquals(token1, token2);
    }

    @Test
    @DisplayName("Should extract correct username from multiple tokens")
    void testMultipleTokens() {
        // Given
        UserDetails user1 = User.builder()
                .username("user1")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();
        
        UserDetails user2 = User.builder()
                .username("user2")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String token1 = jwtService.generateToken(user1);
        String token2 = jwtService.generateToken(user2);

        // When
        String extractedUser1 = jwtService.extractUsername(token1);
        String extractedUser2 = jwtService.extractUsername(token2);

        // Then
        assertEquals("user1", extractedUser1);
        assertEquals("user2", extractedUser2);
        assertNotEquals(token1, token2);
    }

    @Test
    @DisplayName("Should contain correct issued date")
    void testIssuedAt() {
        // Given
        long beforeGeneration = System.currentTimeMillis();
        String token = jwtService.generateToken(testUserDetails);
        long afterGeneration = System.currentTimeMillis();

        // When
        Date issuedAt = jwtService.extractClaim(token, Claims::getIssuedAt);

        // Then
        assertNotNull(issuedAt);
        assertTrue(issuedAt.getTime() >= beforeGeneration - 1000); // Allow 1s tolerance
        assertTrue(issuedAt.getTime() <= afterGeneration + 1000);
    }

    @Test
    @DisplayName("Should set expiration to 24 hours from now")
    void testExpiration() {
        // Given
        long now = System.currentTimeMillis();
        String token = jwtService.generateToken(testUserDetails);

        // When
        Date expiration = jwtService.extractClaim(token, Claims::getExpiration);
        long expectedExpiration = now + (1000L * 60 * 60 * 24); // 24 hours

        // Then
        assertNotNull(expiration);
        // Allow 5 second tolerance for test execution time
        assertTrue(Math.abs(expiration.getTime() - expectedExpiration) < 5000);
    }

    @Test
    @DisplayName("Should not be expired immediately after creation")
    void testNotExpiredAfterCreation() {
        // Given
        String token = jwtService.generateToken(testUserDetails);

        // When
        boolean isValid = jwtService.isTokenValid(token, testUserDetails);

        // Then
        assertTrue(isValid);
    }
}
