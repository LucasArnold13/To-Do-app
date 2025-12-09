package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.example.backend.model.ToDo;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ToDoService;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class ToDoController {

    private final ToDoService todoService;
    private final UserRepository userRepository;

    public ToDoController(ToDoService todoService, UserRepository userRepository) {
        this.todoService = todoService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = auth.getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    @PostMapping
    public ResponseEntity<ToDo> create(@RequestBody ToDo todo) {
        User user = getCurrentUser();
        todo.setUser(user);
        ToDo created = todoService.createToDo(todo);
        return ResponseEntity.created(URI.create("/api/todos/" + created.getId())).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ToDo> get(@PathVariable Long id) {
        User user = getCurrentUser();
        return todoService.getToDo(id)
            .filter(todo -> todo.getUser().getId().equals(user.getId()))
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ToDo>> list() {
        User user = getCurrentUser();
        List<ToDo> todos = todoService.getToDosForUser(user);
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/completed/{completed}")
    public ResponseEntity<List<ToDo>> listByCompleted(@PathVariable Boolean completed) {
        User user = getCurrentUser();
        List<ToDo> todos = todoService.getCompletedToDosForUser(user, completed);
        return ResponseEntity.ok(todos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ToDo> update(@PathVariable Long id, @RequestBody ToDo todo) {
        User user = getCurrentUser();
        return todoService.getToDo(id)
            .filter(existing -> existing.getUser().getId().equals(user.getId()))
            .map(existing -> {
                todo.setId(id);
                todo.setUser(user);
                return ResponseEntity.ok(todoService.updateToDo(id, todo));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User user = getCurrentUser();
        return todoService.getToDo(id)
            .filter(todo -> todo.getUser().getId().equals(user.getId()))
            .map(todo -> {
                todoService.deleteToDo(id);
                return ResponseEntity.noContent().<Void>build();
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
