package com.eventflow.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventflow.entity.Booking;
import com.eventflow.entity.Event;
import com.eventflow.repository.BookingRepository;
import com.eventflow.repository.EventRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    //BOOK EVENT
    public Booking bookEvent(long eventId, String userEmail)
    {
        Event event= eventRepository.findById(eventId)
        .orElseThrow(() ->
         new RuntimeException("Event Not found")
        );

        Booking booking=new Booking();

        booking.setUserEmail(userEmail);
        booking.setEventTitle(event.getTitle());
        booking.setBookingTime(LocalDateTime.now());


        //Duplicate Booking prevention

        if(bookingRepository.existsByUserEmailAndEventTitle(userEmail, event.getTitle()))
        {
            throw new RuntimeException("You already booked this event");
        }

        return bookingRepository.save(booking);
    }

    //GET USER BOOKINGS
    public List<Booking> getUserBookings(String userEmail)
    {
        return bookingRepository.findByUserEmail(userEmail);

    }
}
