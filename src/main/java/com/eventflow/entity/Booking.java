package com.eventflow.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private  String userEmail;
    private  String eventTitle;
    private LocalDateTime bookingTime;

}
