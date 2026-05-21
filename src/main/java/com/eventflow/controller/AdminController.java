package com.eventflow.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventflow.dto.DashboardStats;
import com.eventflow.entity.Booking;
import com.eventflow.entity.Event;
import com.eventflow.entity.User;
import com.eventflow.repository.EventRepository;
import com.eventflow.service.AdminService;



@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final EventRepository eventRepository;
    @Autowired
    private AdminService adminService;


    AdminController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

      //Add event
      @PostMapping("/events")
      public Event createEvent(@RequestBody Event event){

       return eventRepository.save(event);
       }

       //Update event
       @PutMapping("/events/{id}")
       public Event updateEvent(@PathVariable Long id,@RequestBody Event updated){

       Event event =eventRepository.findById(id).orElseThrow();

        event.setTitle(updated.getTitle());
        event.setLocation(updated.getLocation());
        event.setDate(updated.getDate());
        event.setCapacity(updated.getCapacity());
        event.setDescription(updated.getDescription());

        return eventRepository.save(event);
     }


    //all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        
        return adminService.getAllUsers();
    }

    //delete users
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id)
    {
        adminService.deleteUser(id);
        return ResponseEntity.ok(
        Map.of("message", "User Deleted Successfully")
);
    }

    //all events
    @GetMapping("/events")
    public List<Event> getAllEvents() {

        return adminService.getAllEvents();
    }
    
    //delete events
    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id)
    {

        adminService.deleteEvent(id);
        
        return ResponseEntity.ok(
            java.util.Map.of(
                "message",
                "Event deleted Succesfully"
            )
        );
    }

      @GetMapping("/bookings")

        public List<Booking> getAllBookings(){

        return adminService.getAllBookings();

    }

    //delete bookings
    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id)
    {

        adminService.deleteBooking(id);

        return ResponseEntity.ok(
            java.util.Map.of(
                "message",
                "Booking deleted Succesfully"
            )
        );
    }

    //DASHBOARD STATS
    @GetMapping("/stats")
    public DashboardStats getStats()
    {
        // return "Total Users: " +adminService.getTotalUsers()
        //  +" | Total Events: " +adminService.getTotalEvents();

        return new DashboardStats

                (adminService.getTotalUsers(), 
                
                adminService.getTotalEvents(),

                adminService.getTotalBookings()
            
            );
    }

}
