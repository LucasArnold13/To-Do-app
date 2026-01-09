package com.example.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.example.backend.model.ToDo;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ToDoService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class ToDoControllerTest {

    @Mock
    private ToDoService todoService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ToDoController todoController;

    private User testUser;
    private ToDo testToDo;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password");

        // Setup test todo
        testToDo = new ToDo();
        testToDo.setId(1L);
        testToDo.setTitle("Test ToDo");
        testToDo.setDescription("Test Description");
        testToDo.setCompleted(false);
        testToDo.setUser(testUser);

        // Setup security context
        setupSecurityContext("testuser");
    }

    private void setupSecurityContext(String username) {
        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void create_valid_created() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(todoService.createToDo(any(ToDo.class))).thenReturn(testToDo);

        ResponseEntity<ToDo> response = todoController.create(testToDo);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Test ToDo", response.getBody().getTitle());
        verify(todoService, times(1)).createToDo(any(ToDo.class));
    }

    @Test
    void get_exists_ok() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(todoService.getToDo(1L)).thenReturn(Optional.of(testToDo));

        ResponseEntity<ToDo> response = todoController.get(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void get_missing_notFound() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(todoService.getToDo(999L)).thenReturn(Optional.empty());

        ResponseEntity<ToDo> response = todoController.get(999L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void get_notOwner_notFound() {
        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setUsername("otheruser");

        ToDo otherUserToDo = new ToDo();
        otherUserToDo.setId(1L);
        otherUserToDo.setTitle("Other User's ToDo");
        otherUserToDo.setUser(otherUser);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(todoService.getToDo(1L)).thenReturn(Optional.of(otherUserToDo));

        ResponseEntity<ToDo> response = todoController.get(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void list_valid_ok() {
        List<ToDo> todos = new ArrayList<>();
        todos.add(testToDo);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(todoService.getToDosForUser(testUser)).thenReturn(todos);

        ResponseEntity<List<ToDo>> response = todoController.list();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void update_valid_ok() {
        ToDo updatedToDo = new ToDo();
        updatedToDo.setTitle("Updated Title");
        updatedToDo.setDescription("Updated Description");
        updatedToDo.setCompleted(true);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(todoService.getToDo(1L)).thenReturn(Optional.of(testToDo));
        when(todoService.updateToDo(anyLong(), any(ToDo.class))).thenReturn(updatedToDo);

        ResponseEntity<ToDo> response = todoController.update(1L, updatedToDo);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Updated Title", response.getBody().getTitle());
    }

    @Test
    void update_missing_notFound() {
        ToDo updatedToDo = new ToDo();
        updatedToDo.setTitle("Updated Title");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(todoService.getToDo(999L)).thenReturn(Optional.empty());

        ResponseEntity<ToDo> response = todoController.update(999L, updatedToDo);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void delete_exists_noContent() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(todoService.getToDo(1L)).thenReturn(Optional.of(testToDo));

        ResponseEntity<Void> response = todoController.delete(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(todoService, times(1)).deleteToDo(1L);
    }

    @Test
    void delete_missing_notFound() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(todoService.getToDo(999L)).thenReturn(Optional.empty());

        ResponseEntity<Void> response = todoController.delete(999L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(todoService, never()).deleteToDo(anyLong());
    }

    @Test
    void listByCompleted_completedTrue_ok() {
        List<ToDo> completedTodos = new ArrayList<>();
        testToDo.setCompleted(true);
        completedTodos.add(testToDo);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(todoService.getCompletedToDosForUser(testUser, true)).thenReturn(completedTodos);

        ResponseEntity<List<ToDo>> response = todoController.listByCompleted(true);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertTrue(response.getBody().get(0).getCompleted());
    }
}
