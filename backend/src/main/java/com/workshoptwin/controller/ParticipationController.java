package com.workshoptwin.controller;

import com.workshoptwin.model.Participation;
import com.workshoptwin.service.ParticipationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/participations")
@CrossOrigin(origins = "http://localhost:4200")
public class ParticipationController {
    
    @Autowired
    private ParticipationService participationService;
    
    @PostMapping("/buy")
    public ResponseEntity<?> buyTicket(@Valid @RequestBody BuyTicketRequest request) {
        try {
            Participation participation = participationService.buyTicket(
                request.getUserId(),
                request.getEventId(),
                request.getEmail(),
                request.getNbPlaces()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(participation);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Participation>> getUserTickets(@PathVariable Long userId) {
        List<Participation> tickets = participationService.getUserTickets(userId);
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Participation>> getEventParticipations(@PathVariable Long eventId) {
        List<Participation> participations = participationService.getEventParticipations(eventId);
        return ResponseEntity.ok(participations);
    }
    
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelParticipation(@PathVariable Long id) {
        try {
            participationService.cancelParticipation(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Classe interne pour la requête
    public static class BuyTicketRequest {
        private Long userId;
        private Long eventId;
        private String email;
        private Integer nbPlaces;
        
        // Getters et Setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        
        public Long getEventId() { return eventId; }
        public void setEventId(Long eventId) { this.eventId = eventId; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public Integer getNbPlaces() { return nbPlaces; }
        public void setNbPlaces(Integer nbPlaces) { this.nbPlaces = nbPlaces; }
    }
}

