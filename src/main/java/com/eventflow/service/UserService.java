package com.eventflow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventflow.entity.User;
import com.eventflow.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user)
    {

        if(userRepository.findByEmail(user.getEmail()).isPresent())
        {
            throw new RuntimeException("Email already exist");
        }

        return userRepository.save(user);
    }

}
