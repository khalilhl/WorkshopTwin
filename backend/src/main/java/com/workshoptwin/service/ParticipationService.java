package com.workshoptwin.service;

import com.workshoptwin.model.Event;
import com.workshoptwin.model.Participation;
import com.workshoptwin.repository.EventRepository;
import com.workshoptwin.repository.ParticipationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ParticipationService {
    
    @Autowired
    private ParticipationRepository participationRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Transactional
    public Participation buyTicket(Long userId, Long eventId, String email, Integer nbPlaces) {
        // Vérifier que l'événement existe
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            throw new RuntimeException("Événement non trouvé avec l'ID : " + eventId);
        }
        
        Event event = eventOpt.get();
        
        // Vérifier qu'il y a assez de places disponibles
        if (event.getNbPlaces() < nbPlaces) {
            throw new RuntimeException("Pas assez de places disponibles. Places disponibles : " + event.getNbPlaces());
        }
        
        // Créer la participation
        Participation participation = new Participation();
        participation.setUserId(userId);
        participation.setEventId(eventId);
        participation.setEmailParticipant(email);
        participation.setNbPlaces(nbPlaces);
        participation.setStatus(Participation.ParticipationStatus.CONFIRMED);
        
        // Réduire le nombre de places disponibles
        event.setNbPlaces(event.getNbPlaces() - nbPlaces);
        eventRepository.save(event);
        
        // Sauvegarder la participation
        return participationRepository.save(participation);
    }
    
    public List<Participation> getUserTickets(Long userId) {
        return participationRepository.findByUserId(userId);
    }
    
    public List<Participation> getEventParticipations(Long eventId) {
        return participationRepository.findByEventId(eventId);
    }
    
    public Optional<Participation> getParticipationById(Long id) {
        return participationRepository.findById(id);
    }
    
    @Transactional
    public void cancelParticipation(Long participationId) {
        Optional<Participation> participationOpt = participationRepository.findById(participationId);
        if (participationOpt.isEmpty()) {
            throw new RuntimeException("Participation non trouvée avec l'ID : " + participationId);
        }
        
        Participation participation = participationOpt.get();
        participation.setStatus(Participation.ParticipationStatus.CANCELLED);
        
        // Remettre les places disponibles
        Optional<Event> eventOpt = eventRepository.findById(participation.getEventId());
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            event.setNbPlaces(event.getNbPlaces() + participation.getNbPlaces());
            eventRepository.save(event);
        }
        
        participationRepository.save(participation);
    }
}

