package com.eventflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eventflow.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

        // Specific event ki saari registrations laayega
        // List<Event> findByCreatedBy(String createdBy);

        long count();

        List<Event> findByOrganizerEmail(String organizerEmail);



}
