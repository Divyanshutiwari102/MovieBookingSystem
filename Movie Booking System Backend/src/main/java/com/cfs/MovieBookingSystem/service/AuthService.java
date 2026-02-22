package com.cfs.MovieBookingSystem.service;

import com.cfs.MovieBookingSystem.dto.RegisterRequest;
import com.cfs.MovieBookingSystem.model.Role;
import com.cfs.MovieBookingSystem.model.RoleName;
import com.cfs.MovieBookingSystem.model.User;
import com.cfs.MovieBookingSystem.repository.RoleRepository;
import com.cfs.MovieBookingSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role userRole = roleRepository.findByName(RoleName.USER)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.getRoles().add(userRole);

        userRepository.save(user);

        return "User registered successfully";
    }
}
