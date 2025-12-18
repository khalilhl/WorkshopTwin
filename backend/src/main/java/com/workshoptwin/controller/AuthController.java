package com.workshoptwin.controller;

import com.workshoptwin.model.User;
import com.workshoptwin.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        try {
            User registeredUser = authService.register(user);
            
            // Retourner une réponse sans le mot de passe
            Map<String, Object> response = new HashMap<>();
            response.put("token", "jwt_token_" + registeredUser.getId() + "_" + System.currentTimeMillis());
            response.put("user", createUserResponse(registeredUser));
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = authService.login(request.getUsername(), request.getPassword());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", "jwt_token_" + user.getId() + "_" + System.currentTimeMillis());
            response.put("user", createUserResponse(user));
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Nom d'utilisateur ou mot de passe incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
    
    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("username", user.getUsername());
        userResponse.put("email", user.getEmail());
        userResponse.put("role", user.getRole());
        return userResponse;
    }
    
    // Classe interne pour la requête de login
    public static class LoginRequest {
        private String username;
        private String password;
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}

