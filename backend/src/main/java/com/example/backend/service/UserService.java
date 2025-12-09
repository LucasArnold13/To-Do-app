package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

@Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id)
    {
        Optional<User> user = userRepository.findById(id);

        return user;
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void deleteUserById(Long id){
        userRepository.deleteById(id);  
    }

    public User saveOrUpdateUser(User user){
        return userRepository.save(user);
    }
}
