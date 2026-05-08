package com.eventflow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.eventflow.entity.User;
import com.eventflow.service.UserService;

@Controller
@RequestMapping("/api/users")
public class HomeController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registeUser(@RequestBody User user) {
        
        return userService.registerUser(user);
    }
    



}
