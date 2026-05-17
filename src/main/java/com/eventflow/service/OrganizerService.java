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

    //GET ORGANIZER EVENTs
    public List<Event> getOrganizerEvents(String organizerEmail)
    {
        return eventRepository.findByCreatedBy(organizerEmail);
    }
    
    //VIEW REGISTRATIONS
    public List<Booking> getEventRegistrations(String eventTitle)
    {
        return bookingRepository.findByEventTitle(eventTitle);

    }

    //EVENT COUNT API
    public int getEventCount(String organizerEmail)
    {
        return eventRepository.findByCreatedBy(organizerEmail).size();
    }





}
