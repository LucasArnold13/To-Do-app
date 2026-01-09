package com.example.backend.service;

import com.example.backend.model.ToDo;
import com.example.backend.model.User;
import com.example.backend.repository.ToDoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ToDoService Unit Tests")
class ToDoServiceTest {

    @Mock
    private ToDoRepository todoRepository;

    @InjectMocks
    private ToDoService todoService;

    private User testUser;
    private ToDo testToDo;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testToDo = new ToDo();
        testToDo.setId(1L);
        testToDo.setTitle("Test ToDo");
        testToDo.setDescription("Test Description");
        testToDo.setCompleted(false);
        testToDo.setDueDate(LocalDateTime.now().plusDays(7));
        testToDo.setUser(testUser);
    }

    @Test
    @DisplayName("Should create ToDo successfully")
    void testCreateToDo() {
        // Given
        when(todoRepository.save(any(ToDo.class))).thenReturn(testToDo);

        // When
        ToDo result = todoService.createToDo(testToDo);

        // Then
        assertNotNull(result);
        assertEquals("Test ToDo", result.getTitle());
        assertEquals("Test Description", result.getDescription());
        assertFalse(result.getCompleted());
        verify(todoRepository, times(1)).save(testToDo);
    }

    @Test
    @DisplayName("Should get ToDo by ID successfully")
    void testGetToDo() {
        // Given
        when(todoRepository.findById(1L)).thenReturn(Optional.of(testToDo));

        // When
        Optional<ToDo> result = todoService.getToDo(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals("Test ToDo", result.get().getTitle());
        verify(todoRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should return empty when ToDo not found")
    void testGetToDoNotFound() {
        // Given
        when(todoRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<ToDo> result = todoService.getToDo(999L);

        // Then
        assertFalse(result.isPresent());
        verify(todoRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Should get all ToDos for user")
    void testGetToDosForUser() {
        // Given
        ToDo todo2 = new ToDo();
        todo2.setId(2L);
        todo2.setTitle("Second ToDo");
        todo2.setUser(testUser);

        List<ToDo> todos = Arrays.asList(testToDo, todo2);
        when(todoRepository.findByUser(testUser)).thenReturn(todos);

        // When
        List<ToDo> result = todoService.getToDosForUser(testUser);

        // Then
        assertEquals(2, result.size());
        assertEquals("Test ToDo", result.get(0).getTitle());
        assertEquals("Second ToDo", result.get(1).getTitle());
        verify(todoRepository, times(1)).findByUser(testUser);
    }

    @Test
    @DisplayName("Should get completed ToDos for user")
    void testGetCompletedToDosForUser() {
        // Given
        testToDo.setCompleted(true);
        List<ToDo> completedTodos = Arrays.asList(testToDo);
        when(todoRepository.findByUserAndCompleted(testUser, true)).thenReturn(completedTodos);

        // When
        List<ToDo> result = todoService.getCompletedToDosForUser(testUser, true);

        // Then
        assertEquals(1, result.size());
        assertTrue(result.get(0).getCompleted());
        verify(todoRepository, times(1)).findByUserAndCompleted(testUser, true);
    }

    @Test
    @DisplayName("Should update ToDo successfully")
    void testUpdateToDo() {
        // Given
        ToDo updatedToDo = new ToDo();
        updatedToDo.setTitle("Updated Title");
        updatedToDo.setDescription("Updated Description");
        updatedToDo.setCompleted(true);
        updatedToDo.setDueDate(LocalDateTime.now().plusDays(14));

        when(todoRepository.findById(1L)).thenReturn(Optional.of(testToDo));
        when(todoRepository.save(any(ToDo.class))).thenReturn(testToDo);

        // When
        ToDo result = todoService.updateToDo(1L, updatedToDo);

        // Then
        assertNotNull(result);
        assertEquals("Updated Title", result.getTitle());
        assertEquals("Updated Description", result.getDescription());
        assertTrue(result.getCompleted());
        verify(todoRepository, times(1)).findById(1L);
        verify(todoRepository, times(1)).save(any(ToDo.class));
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent ToDo")
    void testUpdateToDoNotFound() {
        // Given
        ToDo updatedToDo = new ToDo();
        updatedToDo.setTitle("Updated Title");
        when(todoRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            todoService.updateToDo(999L, updatedToDo);
        });

        assertEquals("ToDo not found with id: 999", exception.getMessage());
        verify(todoRepository, times(1)).findById(999L);
        verify(todoRepository, never()).save(any(ToDo.class));
    }

    @Test
    @DisplayName("Should delete ToDo successfully")
    void testDeleteToDo() {
        // Given
        doNothing().when(todoRepository).deleteById(1L);

        // When
        todoService.deleteToDo(1L);

        // Then
        verify(todoRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should return empty list when user has no ToDos")
    void testGetToDosForUserEmpty() {
        // Given
        when(todoRepository.findByUser(testUser)).thenReturn(Arrays.asList());

        // When
        List<ToDo> result = todoService.getToDosForUser(testUser);

        // Then
        assertTrue(result.isEmpty());
        verify(todoRepository, times(1)).findByUser(testUser);
    }

    @Test
    @DisplayName("Should handle null values in ToDo update")
    void testUpdateToDoWithNullValues() {
        // Given
        ToDo updatedToDo = new ToDo();
        updatedToDo.setTitle("New Title");
        updatedToDo.setDescription(null);
        updatedToDo.setCompleted(false);
        updatedToDo.setDueDate(null);

        when(todoRepository.findById(1L)).thenReturn(Optional.of(testToDo));
        when(todoRepository.save(any(ToDo.class))).thenReturn(testToDo);

        // When
        ToDo result = todoService.updateToDo(1L, updatedToDo);

        // Then
        assertNotNull(result);
        assertEquals("New Title", result.getTitle());
        assertNull(result.getDescription());
        assertNull(result.getDueDate());
        verify(todoRepository, times(1)).save(any(ToDo.class));
    }
}
