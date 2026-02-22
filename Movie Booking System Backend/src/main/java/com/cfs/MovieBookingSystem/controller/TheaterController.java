package com.cfs.MovieBookingSystem.controller;

import com.cfs.MovieBookingSystem.dto.TheaterDto;
import com.cfs.MovieBookingSystem.service.TheaterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theaters")
public class TheaterController {

    @Autowired
    private TheaterService theaterService;

    @PostMapping
    public ResponseEntity<TheaterDto> createTheater(@Valid @RequestBody TheaterDto theaterDto){
        return new ResponseEntity<>(theaterService.createTheater(theaterDto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TheaterDto> getTheaterById(@PathVariable Long id){
        return ResponseEntity.ok(theaterService.getTheaterById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TheaterDto> updateTheater(@PathVariable Long id,
                                                    @Valid @RequestBody TheaterDto theaterDto){
        return ResponseEntity.ok(theaterService.updateTheater(id, theaterDto));
    }
    @GetMapping
    public ResponseEntity<List<TheaterDto>> getAllTheaters(){
        return ResponseEntity.ok(theaterService.getAllTheaters());
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<TheaterDto>> getTheatersByCity(@PathVariable String city){
        return ResponseEntity.ok(theaterService.getAllTheaterByCity(city));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTheater(@PathVariable Long id){
        theaterService.deleteTheater(id);
        return ResponseEntity.ok("Theater deleted successfully");
    }
}
