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

    public SecurityConfig(JwtFilter jwtFilter)
    {

        this.jwtFilter=jwtFilter;

    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable()) //Rest Api ko kallow karta he
                .authorizeHttpRequests(auth -> auth


                    //Public APIs
                    .requestMatchers(
                        "/api/users/regsiter",
                        "/api/users/login"
                    ).permitAll()   //postman request block mat kari


                    //Secure APIs
                    .anyRequest().authenticated()
                )

                .addFilterBefore(
                    jwtFilter, 
                    UsernamePasswordAuthenticationFilter.class
                );

                return http.build();


                 // .anyRequest().permitAll()  
                // .formLogin(form -> form.disable());
    }
}