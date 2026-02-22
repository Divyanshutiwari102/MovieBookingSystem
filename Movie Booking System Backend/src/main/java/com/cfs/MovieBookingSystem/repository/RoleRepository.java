package com.cfs.MovieBookingSystem.repository;

import com.cfs.MovieBookingSystem.model.Role;
import com.cfs.MovieBookingSystem.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}