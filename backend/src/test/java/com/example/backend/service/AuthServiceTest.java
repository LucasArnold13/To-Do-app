package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.utils.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private UserDetails testUserDetails;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("encodedPassword");

        testUserDetails = org.springframework.security.core.userdetails.User
                .withUsername("testuser")
                .password("encodedPassword")
                .authorities("ROLE_USER")
                .build();
    }

    @Test
    @DisplayName("Should login successfully with valid credentials")
    void login_validCredentials_success() {
        // Given
        String username = "testuser";
        String password = "password123";
        String expectedToken = "jwt.token.here";

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(testUserDetails);
        when(jwtService.generateToken(testUserDetails)).thenReturn(expectedToken);

        // When
        String token = authService.login(username, password);

        // Then
        assertNotNull(token);
        assertEquals(expectedToken, token);
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userDetailsService, times(1)).loadUserByUsername(username);
        verify(jwtService, times(1)).generateToken(testUserDetails);
    }

    @Test
    @DisplayName("Should throw exception when login with invalid credentials")
    void login_invalidCredentials_throwsBadCredentials() {
        // Given
        String username = "testuser";
        String password = "wrongpassword";

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // When & Then
        assertThrows(BadCredentialsException.class, () -> {
            authService.login(username, password);
        });

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userDetailsService, never()).loadUserByUsername(anyString());
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    @DisplayName("Should register new user successfully")
    void register_newUser_success() {
        // Given
        String username = "newuser";
        String password = "password123";
        String encodedPassword = "encodedPassword123";
        String expectedToken = "jwt.token.here";

        when(userRepository.existsByUsername(username)).thenReturn(false);
        when(passwordEncoder.encode(password)).thenReturn(encodedPassword);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(testUserDetails);
        when(jwtService.generateToken(testUserDetails)).thenReturn(expectedToken);

        // When
        String token = authService.register(username, password);

        // Then
        assertNotNull(token);
        assertEquals(expectedToken, token);
        verify(userRepository, times(1)).existsByUsername(username);
        verify(passwordEncoder, times(1)).encode(password);
        verify(userRepository, times(1)).save(any(User.class));
        verify(userDetailsService, times(1)).loadUserByUsername(username);
        verify(jwtService, times(1)).generateToken(testUserDetails);
    }

    @Test
    @DisplayName("Should throw exception when registering with existing username")
    void register_existingUsername_throwsIllegalArgumentException() {
        // Given
        String username = "existinguser";
        String password = "password123";

        when(userRepository.existsByUsername(username)).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.register(username, password);
        });

        assertEquals("Username already exists", exception.getMessage());
        verify(userRepository, times(1)).existsByUsername(username);
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    @DisplayName("Should encode password when registering")
    void register_passwordProvided_encodesPassword() {
        // Given
        String username = "newuser";
        String rawPassword = "plainPassword";
        String encodedPassword = "$2a$10$encodedHash";

        when(userRepository.existsByUsername(username)).thenReturn(false);
        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            assertEquals(encodedPassword, savedUser.getPassword());
            return savedUser;
        });
        when(userDetailsService.loadUserByUsername(username)).thenReturn(testUserDetails);
        when(jwtService.generateToken(testUserDetails)).thenReturn("token");

        // When
        authService.register(username, rawPassword);

        // Then
        verify(passwordEncoder, times(1)).encode(rawPassword);
        verify(userRepository, times(1)).save(argThat(user -> 
            user.getPassword().equals(encodedPassword)
        ));
    }

    @Test
    @DisplayName("Should set username correctly when registering")
    void register_usernameProvided_setsUsername() {
        // Given
        String username = "testuser123";
        String password = "password";

        when(userRepository.existsByUsername(username)).thenReturn(false);
        when(passwordEncoder.encode(password)).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            assertEquals(username, savedUser.getUsername());
            return savedUser;
        });
        when(userDetailsService.loadUserByUsername(username)).thenReturn(testUserDetails);
        when(jwtService.generateToken(testUserDetails)).thenReturn("token");

        // When
        authService.register(username, password);

        // Then
        verify(userRepository, times(1)).save(argThat(user -> 
            user.getUsername().equals(username)
        ));
    }
}
