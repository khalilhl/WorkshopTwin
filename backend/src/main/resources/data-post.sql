-- Données initiales pour les événements (exécuté après la création des tables)
-- Note: Les colonnes utilisent les noms générés par Hibernate (camelCase converti en snake_case)
INSERT INTO events (title, description, date, place, price, organizer_id, image_url, nb_places, nb_likes) 
VALUES 
('Angular Summit', 'Conférence sur Angular et l''écosystème front-end', '2025-11-10', 'Tunis', 50.0, 1, 'images/event.png', 25, 0),
('Web dev days', 'Journée dédiée aux frameworks web modernes.', '2025-12-05', 'Ariana', 30.0, 1, 'images/event.png', 50, 0);


