package com.eventflow.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.eventflow.entity.Event;
import com.eventflow.repository.EventRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    //Create event
    public Event createEvent(Event event)
    {
        return eventRepository.save(event);
    }

    //Get All Event
    public List<Event> getAllEvents()
    {
        return eventRepository.findAll();
    }

    //Get Event By ID
    public Event getEventById(Long id)
    {
        return eventRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Event not found"

));
    }

    //Update Event
    public Event updateEvent(long id, Event updatedEvent)
    {
        Event event = getEventById(id);

        event.setTitle(updatedEvent.getTitle());
        event.setDescription(updatedEvent.getDescription());
        event.setLocation(updatedEvent.getLocation());
        event.setDate(updatedEvent.getDate());
        event.setCapacity(updatedEvent.getCapacity());

        return eventRepository.save(event);

    }

    //Delete Event
    public void deleteEvent(Long Id)
    {
        eventRepository.deleteById(Id);
    }

}
