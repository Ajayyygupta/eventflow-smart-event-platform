package com.eventflow.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventflow.entity.Booking;
import com.eventflow.entity.Event;
import com.eventflow.entity.User;
import com.eventflow.repository.BookingRepository;
import com.eventflow.repository.EventRepository;
import com.eventflow.repository.UserRepository;

@Service
public class AdminService {

    private final BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    AdminService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    //Get all useer
    public List<User> getAllUsers()
    {
        return userRepository.findAll();
    }

    //deleete user
    public String deleteUser(Long id)
    {

         User user =userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Userr not found"));

        System.out.println(user.getRole());


        //Protect Admin
        if(user.getRole().equals("ADMIN"))
        {

            System.out.println("ADMIN DETECTED");
            throw new RuntimeException("Cannot delete admin");
        }

        System.out.println("DELETE EXECUTED");
    
        userRepository.deleteById(id);
        return "User Deleted Suceesfully";
    }

    //get all events
    public List<Event> getAllEvents()
    {
        return eventRepository.findAll();   
    }

    //delete event
    public String deleteEvent(Long id)
    {
        eventRepository.deleteById(id);

        return "Event Deleted Successfully";
    }

     //get all bookings
    public List<Booking> getAllBookings()
    {
        return bookingRepository.findAll();
    }

    //delette booking
    public String deleteBooking(Long id)
    {
        return bookingRepository.findById(id).map(booking -> {
            bookingRepository.delete(booking);
            return "Booking Deleted Successfully";
        }).orElse("Booking Not Found");
    }

    //Total users
    public long getTotalUsers()
    {
        return userRepository.count();
    }

    //Total events
    public Long getTotalEvents()
    {
        return eventRepository.count();
    }

    //Total bookings
    public Long getTotalBookings()
    {
        return bookingRepository.count();
    }

    


}
