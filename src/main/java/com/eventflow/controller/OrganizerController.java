package com.eventflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eventflow.entity.Booking;
import com.eventflow.entity.Event;
import com.eventflow.repository.EventRepository;
import com.eventflow.service.OrganizerService;



@RestController
@RequestMapping("/api/organizer")
public class OrganizerController {

    private final EventRepository eventRepository;
    @Autowired
    private OrganizerService organizerService;

    OrganizerController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    //create event
    @PostMapping("/events")
    public Event createEvent(@RequestBody Event event) {

      
        return organizerService.createEvent(event);
        
    }

    //MY EVENTS
    @GetMapping("/events/{email}")
    public List<Event> getMyEvents(@PathVariable String email) {
        return organizerService.getOrganizerEvents(email);
    }

    //EVENT REGISTRATIOM
    @GetMapping("/registrations")
    public List<Booking> getRegistrations(@RequestParam String eventTitle) {
        return organizerService.getEventRegistrations(eventTitle);
    }

    //EVENT COUNT
    @GetMapping("event-count/{email}")
    public int getEventCount(@PathVariable String email) {
        return organizerService.getEventCount(email);
    }
    
    //DELETE EVENT
     @DeleteMapping("/events/{id}")
     public String deleteEvent(@PathVariable Long id)
     {
        eventRepository.deleteById(id);
        return  "Event deleted succesfully";
     }   
        
    

}
