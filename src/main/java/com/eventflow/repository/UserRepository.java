package com.eventflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eventflow.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
