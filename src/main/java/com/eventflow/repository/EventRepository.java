package com.eventflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eventflow.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

}
