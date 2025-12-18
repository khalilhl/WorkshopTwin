package com.workshoptwin.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipationDTO {
    private Long id;
    private Long userId;
    private Long eventId;
    private String emailParticipant;
    private Integer nbPlaces;
    private Participation.ParticipationStatus status;
    private LocalDateTime registrationDate;
    
    // Détails de l'événement
    private String eventTitle;
    private LocalDate eventDate;
    private String eventPlace;
    private Double eventPrice;
    private String eventImageUrl;
    
    public static ParticipationDTO fromParticipation(Participation participation, Event event) {
        ParticipationDTO dto = new ParticipationDTO();
        dto.setId(participation.getId());
        dto.setUserId(participation.getUserId());
        dto.setEventId(participation.getEventId());
        dto.setEmailParticipant(participation.getEmailParticipant());
        dto.setNbPlaces(participation.getNbPlaces());
        dto.setStatus(participation.getStatus());
        dto.setRegistrationDate(participation.getRegistrationDate());
        
        if (event != null) {
            dto.setEventTitle(event.getTitle());
            dto.setEventDate(event.getDate());
            dto.setEventPlace(event.getPlace());
            dto.setEventPrice(event.getPrice());
            dto.setEventImageUrl(event.getImageUrl());
        }
        
        return dto;
    }
}

