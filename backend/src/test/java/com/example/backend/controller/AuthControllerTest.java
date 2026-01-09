package com.example.backend.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletResponse;

import com.example.backend.dto.LoginResponse;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.service.AuthService;

class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        response = new MockHttpServletResponse();
    }

    @Test
    void register_newUser_created() {
        RegisterRequest request = new RegisterRequest("newuser", "password123");
        String expectedJwt = "jwt.token.here";

        when(authService.register("newuser", "password123")).thenReturn(expectedJwt);

        ResponseEntity<?> result = authController.register(request, response);

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue(result.getBody() instanceof LoginResponse);
        assertEquals(expectedJwt, ((LoginResponse) result.getBody()).getToken());
        
        // Verify JWT cookie was set
        String setCookieHeader = response.getHeader("Set-Cookie");
        assertNotNull(setCookieHeader);
        assertTrue(setCookieHeader.contains("jwt=" + expectedJwt));
        assertTrue(setCookieHeader.contains("HttpOnly"));
        assertTrue(setCookieHeader.contains("Path=/"));
        
        verify(authService, times(1)).register("newuser", "password123");
    }

    @Test
    void register_existingUser_conflict() {
        RegisterRequest request = new RegisterRequest("existinguser", "password123");

        when(authService.register("existinguser", "password123"))
            .thenThrow(new IllegalArgumentException("Username already exists"));

        ResponseEntity<?> result = authController.register(request, response);

        assertEquals(HttpStatus.CONFLICT, result.getStatusCode());
        assertEquals("Username already exists", result.getBody());
        verify(authService, times(1)).register("existinguser", "password123");
    }

    @Test
    void register_invalidInput_conflict() {
        RegisterRequest request = new RegisterRequest(null, "password123");

        when(authService.register(null, "password123"))
            .thenThrow(new IllegalArgumentException("Username is required"));

        ResponseEntity<?> result = authController.register(request, response);

        assertEquals(HttpStatus.CONFLICT, result.getStatusCode());
        assertTrue(result.getBody() instanceof String);
    }
}
