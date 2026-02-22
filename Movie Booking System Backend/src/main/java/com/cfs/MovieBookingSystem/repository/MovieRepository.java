package com.cfs.MovieBookingSystem.repository;

import com.cfs.MovieBookingSystem.model.Movie;
import org.apache.catalina.LifecycleState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import  java.util.*;
@Repository
public interface  MovieRepository extends JpaRepository<Movie,Long> {
    List<Movie> findByLanguage(String language);
    List<Movie> findByGenre(String genre);
    List<Movie> findByTitleContaining(String title);


    
}
