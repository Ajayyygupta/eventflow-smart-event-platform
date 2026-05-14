package com.eventflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventflow.entity.Event;
import com.eventflow.service.EventService;





@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    //Create EVENT
    @PostMapping("/create")
    public Event createEvent(@RequestBody Event event) {
        
        return eventService.createEvent(event);
    }

    //Get ALL EVENT
    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    //Get By ID
    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {

        System.out.println("Controller Hit ID:"+ id);
        return eventService.getEventById(id);
    }

    //Update Event
    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event event) {
        
        return eventService.updateEvent(id, event);    
    }

    //Delete Event
    @DeleteMapping("{id}")
    public String deleteEvent(@PathVariable Long id)
    {
        eventService.deleteEvent(id);
        return "Event Delete Succesfully";
    }
    
    
    



}
