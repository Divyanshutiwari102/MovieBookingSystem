package com.cfs.MovieBookingSystem.repository;

import com.cfs.MovieBookingSystem.model.Theater;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheaterRepository extends JpaRepository<Theater,Long > {

    List<Theater> findByCity(String city);
}
