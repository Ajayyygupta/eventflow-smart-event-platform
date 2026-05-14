package com.eventflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eventflow.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserEmail(String userEmail);
    

}
