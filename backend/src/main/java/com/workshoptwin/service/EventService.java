package com.workshoptwin.service;

import com.workshoptwin.model.Event;
import com.workshoptwin.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }
    
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }
    
    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'ID : " + id));
        
        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setDate(eventDetails.getDate());
        event.setPlace(eventDetails.getPlace());
        event.setPrice(eventDetails.getPrice());
        event.setNbPlaces(eventDetails.getNbPlaces());
        event.setImageUrl(eventDetails.getImageUrl());
        event.setDomaines(eventDetails.getDomaines());
        
        return eventRepository.save(event);
    }
    
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
    
    public Event incrementLikes(Long id) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'ID : " + id));
        
        event.setNbLikes(event.getNbLikes() + 1);
        return eventRepository.save(event);
    }
    
    public Event decrementPlaces(Long id) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'ID : " + id));
        
        if (event.getNbPlaces() > 0) {
            event.setNbPlaces(event.getNbPlaces() - 1);
            return eventRepository.save(event);
        }
        throw new RuntimeException("Aucune place disponible");
    }
}

