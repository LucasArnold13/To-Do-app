package com.example.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;



@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletResponse response) {
    try {
        String jwt = authService.register(request.getUsername(), request.getPassword());

        ResponseCookie cookie = ResponseCookie.from("jwt", jwt)
                                              .httpOnly(true)
                                              .path("/")
                                              .maxAge(24 * 60 * 60)
                                              .sameSite("None")
                                              .secure(true)
                                              .build();
        response.addHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.status(HttpStatus.CREATED).body(new LoginResponse(jwt));
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }
}

@PostMapping("/login")
public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request, HttpServletResponse response) {

    // Token generieren
    String jwt = authService.login(request.getUsername(), request.getPassword());

    // JWT als HttpOnly-Cookie setzen
    ResponseCookie cookie = ResponseCookie.from("jwt", jwt)
                                          .httpOnly(true)    // nur Server-seitig lesbar
                                          .path("/")         // überall gültig
                                          .maxAge(24 * 60 * 60) // 1 Tag
                                          .sameSite("None")   
                                          .secure(true)
                                          .build();
    response.addHeader("Set-Cookie", cookie.toString());

    // Optional: Token auch im Body zurückgeben (für Testzwecke)
    return ResponseEntity.ok(new LoginResponse(jwt));
}


    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        System.out.println("Authentication Objekt: " + authentication);
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nicht eingeloggt");
        }

        // Optional: User-Details aus Authentication holen
        String username = authentication.getName();
        return ResponseEntity.ok("Eingeloggt als: " + username);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // Clear server-side security context
        SecurityContextHolder.clearContext();

        // Overwrite JWT cookie to remove it in the browser
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                                              .httpOnly(true)
                                              .path("/")
                                              .maxAge(0)
                                              .sameSite("None")
                                              .secure(true)
                                              .build();
        response.addHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.noContent().build();
    }
}
