package com.eventflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eventflow.entity.Booking;
import com.eventflow.entity.Event;
import com.eventflow.service.OrganizerService;


@RestController
@RequestMapping("/api/organizer")
public class OrganizerController {

    @Autowired
    private OrganizerService organizerService;

    //MY EVENTS
    @GetMapping("/events")
    public List<Event> getMyEvents(@RequestParam String organizerEmail) {
        return organizerService.getOrganizerEvents(organizerEmail);
    }

    //EVENT REGISTRATIOM
    @GetMapping("/registrations")
    public List<Booking> getRegistrations(@RequestParam String eventTitle) {
        return organizerService.getEventRegistrations(eventTitle);
    }

    //EVENT COUNT
    @GetMapping("event-count")
    public int getEventCount(@RequestParam String organizerEmail) {
        return organizerService.getEventCount(organizerEmail);
    }
    
        
    

}
