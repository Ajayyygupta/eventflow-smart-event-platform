package com.eventflow.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // PUBLIC APIs
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/login.html",
                    "/register.html",
                    "/dashboard.html",
                    "/admin.html",
                    "/organizer.html",
                
                    
                    
                    
                    "/css/**",
                    "/js/**",

                    "/api/users/register",
                     "/api/users/login",
                     "/api/admin/users",
                     "/api/admin/events",
                     "/api/admin/bookings",
                     "/api/admin/stats",
                     "/api/organizer/events",
                     "/api/organizer/bookings",
                     "/api/organizer/stats",
                     "/api/organizer/email"

                ).permitAll()


              // ADMIN
                .requestMatchers(
                        "/api/admin/**"
                             ).hasRole("ADMIN")

             // ORGANIZER
                 .requestMatchers(
                        "/api/organizer/**"
                             ).hasAnyRole("ORGANIZER", "ADMIN")
                //  ).hasRole("ORGANIZER")

                             
             // USER
                 .requestMatchers(
                        "/api/users/user/**"
                             ).hasRole("USER")


                // ALL OTHER APIs
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                    jwtFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}