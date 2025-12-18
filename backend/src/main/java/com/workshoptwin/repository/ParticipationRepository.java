package com.workshoptwin.repository;

import com.workshoptwin.model.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    List<Participation> findByEventId(Long eventId);
    List<Participation> findByUserId(Long userId);
}

