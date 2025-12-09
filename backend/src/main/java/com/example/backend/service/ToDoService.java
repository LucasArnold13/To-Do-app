package com.example.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.backend.model.ToDo;
import com.example.backend.model.User;
import com.example.backend.repository.ToDoRepository;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ToDoService {

    private final ToDoRepository todoRepository;

    public ToDoService(ToDoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public ToDo createToDo(ToDo todo) {
        return todoRepository.save(todo);
    }

    public Optional<ToDo> getToDo(Long id) {
        return todoRepository.findById(id);
    }

    public List<ToDo> getToDosForUser(User user) {
        return todoRepository.findByUser(user);
    }

    public List<ToDo> getCompletedToDosForUser(User user, Boolean completed) {
        return todoRepository.findByUserAndCompleted(user, completed);
    }

    public ToDo updateToDo(Long id, ToDo todo) {
        return todoRepository.findById(id)
            .map(existing -> {
                existing.setTitle(todo.getTitle());
                existing.setDescription(todo.getDescription());
                existing.setCompleted(todo.getCompleted());
                return todoRepository.save(existing);
            })
            .orElseThrow(() -> new RuntimeException("ToDo not found with id: " + id));
    }

    public void deleteToDo(Long id) {
        todoRepository.deleteById(id);
    }
}
