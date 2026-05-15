package com.eventflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eventflow.entity.Booking;
import com.eventflow.service.BookingService;



@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    //BOOK EVENT
    @PostMapping("/{eventId}")
    public Booking bookEvent(@PathVariable Long eventId, @RequestParam String userEmail) {

        return bookingService.bookEvent(eventId, userEmail);

    }

    //VIEW USER BOOKING
    @GetMapping
    public List<Booking> getBookings(@RequestParam String userEmail) {
        return bookingService.getUserBookings(userEmail);
    }
    


}
