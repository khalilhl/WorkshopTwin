package com.workshoptwin.config;

import com.workshoptwin.model.Event;
import com.workshoptwin.repository.EventRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final EventRepository eventRepository;

    public DataInitializer(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Vérifier si des données existent déjà
        if (eventRepository.count() == 0) {
            // Créer les événements initiaux
            Event event1 = new Event();
            event1.setTitle("Angular Summit");
            event1.setDescription("Conférence sur Angular et l'écosystème front-end");
            event1.setDate(LocalDate.of(2025, 11, 10));
            event1.setPlace("Tunis");
            event1.setPrice(50.0);
            event1.setOrganizerId(1L);
            event1.setImageUrl("images/event.png");
            event1.setNbPlaces(25);
            event1.setNbLikes(0);

            Event event2 = new Event();
            event2.setTitle("Web dev days");
            event2.setDescription("Journée dédiée aux frameworks web modernes.");
            event2.setDate(LocalDate.of(2025, 12, 5));
            event2.setPlace("Ariana");
            event2.setPrice(30.0);
            event2.setOrganizerId(1L);
            event2.setImageUrl("images/event.png");
            event2.setNbPlaces(50);
            event2.setNbLikes(0);

            eventRepository.save(event1);
            eventRepository.save(event2);

            System.out.println("✅ Données initiales créées avec succès!");
        }
    }
}

