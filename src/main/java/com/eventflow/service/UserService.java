package com.eventflow.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.eventflow.config.JwtUtil;
import com.eventflow.dto.LoginResponse;
import com.eventflow.entity.User;
import com.eventflow.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;


    //Register
    public User registerUser(User user)
    {

        System.out.println("Service hit");

        //EMAIL CHEACK
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new RuntimeException("Email already exist"); 
        }

         //Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword())
        );

        //SAVE USER
        User savedUser = userRepository.save(user);
        System.out.println(savedUser);
        return savedUser;
        // return userRepository.save(user);
    }

    public LoginResponse loginUser(String email, String password) {
        String normalizedEmail = email.trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .or(() -> userRepository.findByEmail(email.trim()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        String role = user.getRole() != null ? user.getRole().trim().toUpperCase() : "USER";
        return new LoginResponse(token, role, user.getEmail());
    }


    //Select all user from API
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

}
