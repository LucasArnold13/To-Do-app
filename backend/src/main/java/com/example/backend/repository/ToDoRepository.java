package com.example.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.model.ToDo;
import com.example.backend.model.User;
import java.util.List;

@Repository
public interface ToDoRepository extends JpaRepository<ToDo, Long> {
    List<ToDo> findByUser(User user);
    Page<ToDo> findByUser(User user, Pageable pageable);
    List<ToDo> findByUserAndCompleted(User user, Boolean completed);
}
