package com.cfs.MovieBookingSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private String phoneNumber;

    // optional – agar multiple roles assign karna ho
    private Set<String> roles;
}
