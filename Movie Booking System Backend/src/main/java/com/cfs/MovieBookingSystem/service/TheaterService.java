package com.cfs.MovieBookingSystem.service;

import com.cfs.MovieBookingSystem.dto.TheaterDto;
import com.cfs.MovieBookingSystem.exception.ResourceNotFoundException;
import com.cfs.MovieBookingSystem.model.Theater;
import com.cfs.MovieBookingSystem.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TheaterService {
    @Autowired
    private TheaterRepository theaterRepository;

    public TheaterDto createTheater(TheaterDto theaterDto){
        Theater theater =mapToEntity(theaterDto);
        Theater savedTheater= theaterRepository.save(theater);
        return mapToDto(savedTheater);
    }

    public TheaterDto getTheaterById(Long id){
        Theater theater= theaterRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Theater Not found with id:"+id));
        return mapToDto(theater);

    }

    public List<TheaterDto> getAllTheaters() {
        List<Theater> theaters = theaterRepository.findAll();
        return theaters.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());


    }

    public List<TheaterDto> getAllTheaterByCity(String city) {
        List<Theater> theaters = theaterRepository.findByCity(city);
        return theaters.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());


    }

    // update theater
    public TheaterDto updateTheater(Long id, TheaterDto theaterDto){
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theater Not Found with id :" + id));

        theater.setName(theaterDto.getName());
        theater.setAddress(theaterDto.getAddress());
        theater.setCity(theaterDto.getCity());
        theater.setTotalScreens(theaterDto.getTotalScreens());

        Theater updatedTheater = theaterRepository.save(theater);
        return mapToDto(updatedTheater);
    }

    // delete theater
    public void deleteTheater(Long id){
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theater Not Found with id :" + id));

        theaterRepository.delete(theater);
    }


    private TheaterDto mapToDto(Theater theater){

        TheaterDto theaterDto = new TheaterDto();
        theaterDto.setId(theater.getId());
        theaterDto.setName(theater.getName());
        theaterDto.setAddress(theater.getAddress());
        theaterDto.setCity(theater.getCity());
        theaterDto.setTotalScreens(theater.getTotalScreens());
        return theaterDto;

    }

    private Theater mapToEntity(TheaterDto theaterDto){

        Theater theater =new Theater();
        theater.setName(theaterDto.getName());
        theater.setAddress(theaterDto.getAddress());
        theater.setCity(theaterDto.getCity());
        theater.setTotalScreens(theaterDto.getTotalScreens());
        return theater;

    }
}
