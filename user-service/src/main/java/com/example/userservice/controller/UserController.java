package com.example.userservice.controller;

import com.example.userservice.dto.LoginRequest;
import com.example.userservice.dto.UserDTO;
import com.example.userservice.dto.UserUpdateRequest;
import com.example.userservice.entity.User;
import com.example.userservice.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO register(@RequestBody User user) {
        logger.info("Registering user: {}", user.getUsername());
        return userService.createUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for: {}", loginRequest.getUsername());
        return userService.login(loginRequest);
    }

    @GetMapping("/{username}")
    public UserDTO getUser(@PathVariable String username) {
        logger.info("Fetching user: {}", username);
        return userService.getUserByUsername(username);
    }

    @GetMapping("/current")
    public UserDTO getCurrentUser() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            logger.info("Fetching current user: {}", username);
            if (username == null || username.equals("anonymousUser")) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
            }
            return userService.getUserByUsername(username);
        } catch (Exception e) {
            logger.error("Error fetching current user: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch current user: " + e.getMessage());
        }
    }

    @PutMapping("/current")
    public UserDTO updateCurrentUser(@RequestBody UserUpdateRequest updateRequest) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            logger.info("Updating current user: {}", username);
            if (username == null || username.equals("anonymousUser")) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
            }
            return userService.updateUser(username, updateRequest.getEmail(), updateRequest.getPassword());
        } catch (Exception e) {
            logger.error("Error updating current user: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update user: " + e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDTO> getAllUsers() {
        logger.info("Admin fetching all users");
        return userService.getAllUsers();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        logger.info("Admin deleting user with ID: {}", id);
        userService.deleteUser(id);
    }
}