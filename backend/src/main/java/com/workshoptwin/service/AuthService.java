package com.workshoptwin.service;

import com.workshoptwin.model.User;
import com.workshoptwin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public User register(User user) {
        // Vérifier si le nom d'utilisateur existe déjà
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Ce nom d'utilisateur est déjà utilisé");
        }
        
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }
        
        // Définir le rôle par défaut
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        
        // En production, le mot de passe devrait être hashé avec BCrypt
        // Pour l'instant, on le stocke en clair (à améliorer)
        
        return userRepository.save(user);
    }
    
    public Optional<User> login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // En production, comparer avec BCrypt
            // Pour l'instant, comparaison simple
            if (user.getPassword().equals(password)) {
                return Optional.of(user);
            }
        }
        
        return Optional.empty();
    }
    
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}

