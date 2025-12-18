package com.workshoptwin.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "participations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Participation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "L'ID de l'utilisateur est obligatoire")
    @Column(nullable = false)
    private Long userId;
    
    @NotNull(message = "L'ID de l'événement est obligatoire")
    @Column(name = "event_id", nullable = false)
    private Long eventId;
    
    @NotBlank(message = "L'email du participant est obligatoire")
    @Email(message = "L'email doit être valide")
    @Column(nullable = false)
    private String emailParticipant;
    
    @NotNull(message = "Le nombre de places est obligatoire")
    @Min(value = 1, message = "Le nombre de places doit être au moins 1")
    @Column(nullable = false)
    private Integer nbPlaces;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipationStatus status = ParticipationStatus.PENDING;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime registrationDate = LocalDateTime.now();
    
    public enum ParticipationStatus {
        CONFIRMED, PENDING, CANCELLED
    }
}

