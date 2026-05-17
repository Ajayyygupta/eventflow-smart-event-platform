package com.eventflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventflow.entity.User;
import com.eventflow.service.AdminService;

import org.springframework.web.bind.annotation.RequestParam;

import com.eventflow.entity.Event;



@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;


    //all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        
        return adminService.getAllUsers();
    }

    //delete users
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id)
    {
        return adminService.deleteUser(id);
    }

    //all events
    @GetMapping("/events")
    public List<Event> getAllEvents() {

        return adminService.getAllEvents();
    }
    
    //delete events
    @DeleteMapping("/events/{id}")
    public String deleteEvent(@PathVariable Long id)
    {
        return adminService.deleteEvent(id);
    }

    //DASHBOARD STATS
    @GetMapping("/stats")
    public String getStats()
    {
        return "Total Users: " +adminService.getTotalUsers() +" | Total Events: " +adminService.getTotalEvents();
    }

    

    



}
