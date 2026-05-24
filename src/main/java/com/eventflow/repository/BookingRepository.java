package com.eventflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.eventflow.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserEmail(String userEmail);

    //Duplicate booking prevention
    boolean existsByUserEmailAndEventTitle(String userEmail, String eventTitle);

    //Specific event ki saari registrations laayega
    List<Booking> findByEventTitle(String eventTitle);

    long count();

    //  List<Booking> findByEvent_OrganizerEmail(
    //         String organizerEmail
    // );


    @Query("""

        SELECT b
        FROM Booking b
        JOIN Event e
        ON b.eventId = e.id
        WHERE e.organizerEmail = :email

    """)
    List<Booking> findOrganizerBookings(String email);
    

}
