package com.eventflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventflow.dto.LoginRequest;
import com.eventflow.entity.User;
import com.eventflow.service.UserService;


@RestController
@RequestMapping("/api/users")
public class HomeController {

    @Autowired
    private UserService userService;

    // REGISTER
    // @PostMapping("/register")
    // public User registeUser(@RequestBody User user) {
    //     return userService.registerUser(user);
    // }

    //REGISTET (if email alreaady exist ke liye)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

    try {
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);

    } catch (RuntimeException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());
    }
   }

    // LoGIN
    @PostMapping("/login")
    public String loginUser(@RequestBody LoginRequest request) {
        
        return userService.loginUser(
            request.getEmail(),
            request.getPassword()
        );    
    }
    

    @GetMapping
    public List<User> getAllUsers() {
         return userService.getAllUsers();
    }
    
    @GetMapping("/profile")
    public String profile() {
        return "Welcomd to protected profile API";
    }
    



}
