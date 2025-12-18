package com.workshoptwin.repository;

import com.workshoptwin.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByTitleContainingIgnoreCaseOrPlaceContainingIgnoreCase(String title, String place);
}

