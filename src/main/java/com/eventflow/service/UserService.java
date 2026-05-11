package com.eventflow.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.eventflow.entity.User;
import com.eventflow.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    //Register
    public User registerUser(User user)
    {
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new RuntimeException("Email already exist"); }

            //Encrypt password
            user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    //Login
    public String loginUser(String email, String password)
    {
        User user= userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

        //Password checck
        if(passwordEncoder.matches(password, user.getPassword())){

            return "Login Succesfull";
        }
        throw new RuntimeException("Invalid password");

    }


    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

}
