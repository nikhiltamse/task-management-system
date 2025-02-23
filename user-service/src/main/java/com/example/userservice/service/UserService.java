package com.example.userservice.service;

import com.example.userservice.dto.LoginRequest;
import com.example.userservice.dto.UserDTO;
import com.example.userservice.entity.User;
import com.example.userservice.repository.UserRepository;
import com.example.userservice.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public UserDTO createUser(User user) {
        logger.info("Creating user: {}", user.getUsername());
        user.setRoles("USER");
        User savedUser = userRepository.save(user);
        return new UserDTO(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail(), savedUser.getRoles());
    }

    public String login(LoginRequest loginRequest) {
        logger.info("Login attempt for username: {}", loginRequest.getUsername());
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> {
                    logger.error("User not found: {}", loginRequest.getUsername());
                    return new RuntimeException("User not found");
                });
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            logger.error("Invalid password for user: {}", loginRequest.getUsername());
            throw new RuntimeException("Invalid password");
        }
        logger.info("Generated token for user: {}", user.getUsername());
        return jwtUtil.generateToken(user.getUsername(), user.getRoles());
    }

    public UserDTO getUserByUsername(String username) {
        logger.info("Fetching user: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRoles());
    }

    public UserDTO updateUser(String username, String email, String password) {
        logger.info("Updating user: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmail(email);
        if (password != null && !password.isEmpty()) {
            user.setPassword(password);
        }
        User updatedUser = userRepository.save(user);
        return new UserDTO(updatedUser.getId(), updatedUser.getUsername(), updatedUser.getEmail(), updatedUser.getRoles());
    }

    public List<UserDTO> getAllUsers() {
        logger.info("Fetching all users");
        return userRepository.findAll().stream()
                .map(user -> new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRoles()))
                .collect(Collectors.toList());
    }

    public void deleteUser(Long id) {
        logger.info("Deleting user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}