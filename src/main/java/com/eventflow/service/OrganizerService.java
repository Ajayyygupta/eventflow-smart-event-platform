package com.eventflow.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventflow.entity.Booking;
import com.eventflow.entity.Event;
import com.eventflow.repository.BookingRepository;
import com.eventflow.repository.EventRepository;

@Service
public class OrganizerService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private BookingRepository bookingRepository;

    //CREATE EVENT
    public Event createEvent(Event event)
    {
        return eventRepository.save(event);
    }

    //GET ORGANIZER EVENTs
    public List<Event> getOrganizerEvents(String email)
    {
        return eventRepository.findByOrganizerEmail(email);
    }
    
    //VIEW REGISTRATIONS
    public List<Booking> getEventRegistrations(String eventTitle)
    {
        return bookingRepository.findByEventTitle(eventTitle);

    }

    //EVENT COUNT API
    public int getEventCount(String email)
    {
        return eventRepository.findByOrganizerEmail(email).size();
    }


    public List<Booking> getOrganizerBookings(String email)
    {
        return bookingRepository.findOrganizerBookings(email);
    }

}
