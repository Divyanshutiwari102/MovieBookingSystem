package com.cfs.MovieBookingSystem.service;

import com.cfs.MovieBookingSystem.dto.*;
import com.cfs.MovieBookingSystem.exception.ResourceNotFoundException;
import com.cfs.MovieBookingSystem.model.*;
import com.cfs.MovieBookingSystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ScreenRepository screenRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private ShowSeatRepository showSeatRepository;

    // ✅ UPDATED CREATE SHOW
    public ShowDto createShow(ShowDto showDto) {

        Show show = new Show();

        Movie movie = movieRepository.findById(showDto.getMovie().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie Not Found"));

        Screen screen = screenRepository.findById(showDto.getScreen().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen Not Found"));

        // ✅ CHANGE 1: Overlap validation added
        boolean exists = showRepository
                .existsByScreenAndStartTimeLessThanAndEndTimeGreaterThan(
                        screen,
                        showDto.getStartTime().plusMinutes(movie.getDurationMins()),
                        showDto.getStartTime()
                );

        if (exists) {
            throw new RuntimeException("Show timing overlaps with existing show");
        }

        show.setMovie(movie);
        show.setScreen(screen);

        // ✅ CHANGE 2: End time auto calculated
        show.setStartTime(showDto.getStartTime());
        show.setEndTime(
                showDto.getStartTime()
                        .plusMinutes(movie.getDurationMins())
        );

        Show savedShow = showRepository.save(show);

        List<ShowSeat> availableSeats =
                showSeatRepository.findByShowIdAndStatus(savedShow.getId(), "AVAILABLE");

        return mapToDto(savedShow, availableSeats);
    }

    public ShowDto getShowById(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show not Found with id " + id));

        List<ShowSeat> availableSeats =
                showSeatRepository.findByShowIdAndStatus(show.getId(), "AVAILABLE");

        return mapToDto(show, availableSeats);
    }

    public List<ShowDto> getAllShows() {
        return showRepository.findAll().stream()
                .map(show -> {
                    List<ShowSeat> availableSeats =
                            showSeatRepository.findByShowIdAndStatus(show.getId(), "AVAILABLE");
                    return mapToDto(show, availableSeats);
                })
                .collect(Collectors.toList());
    }

    public List<ShowDto> getShowsByMovie(Long movieId) {
        return showRepository.findByMovieId(movieId).stream()
                .map(show -> {
                    List<ShowSeat> availableSeats =
                            showSeatRepository.findByShowIdAndStatus(show.getId(), "AVAILABLE");
                    return mapToDto(show, availableSeats);
                })
                .collect(Collectors.toList());
    }

    public List<ShowDto> getShowsByMovieAndCity(Long movieId, String city) {
        return showRepository.findByMovie_IdAndScreen_Theater_City(movieId, city).stream()
                .map(show -> {
                    List<ShowSeat> availableSeats =
                            showSeatRepository.findByShowIdAndStatus(show.getId(), "AVAILABLE");
                    return mapToDto(show, availableSeats);
                })
                .collect(Collectors.toList());
    }

    public List<ShowDto> getShowsByDateRange(LocalDateTime startDate, LocalDateTime endTime) {
        return showRepository.findByStartTimeBetween(startDate, endTime).stream()
                .map(show -> {
                    List<ShowSeat> availableSeats =
                            showSeatRepository.findByShowIdAndStatus(show.getId(), "AVAILABLE");
                    return mapToDto(show, availableSeats);
                })
                .collect(Collectors.toList());
    }

    // ✅ UPDATED MAPPING
    public ShowDto mapToDto(Show show, List<ShowSeat> availableSeats) {

        ShowDto showDto = new ShowDto();
        showDto.setId(show.getId());
        showDto.setStartTime(show.getStartTime());
        showDto.setEndTime(show.getEndTime());

        showDto.setMovie(new MovieDto(
                show.getMovie().getId(),
                show.getMovie().getTitle(),
                show.getMovie().getDescription(),
                show.getMovie().getLanguage(),
                show.getMovie().getGenre(),
                show.getMovie().getDurationMins(),
                show.getMovie().getReleaseDate(),
                show.getMovie().getPosterUrl()
        ));

        TheaterDto theaterDto = new TheaterDto(
                show.getScreen().getTheater().getId(),
                show.getScreen().getTheater().getName(),
                show.getScreen().getTheater().getAddress(),
                show.getScreen().getTheater().getCity(),
                show.getScreen().getTheater().getTotalScreens()
        );

        showDto.setScreen(new ScreenDto(
                show.getScreen().getId(),
                show.getScreen().getName(),
                show.getScreen().getTotalSeats(),
                theaterDto
        ));

        // ✅ CHANGE 3: Fixed seat ID mapping
        List<ShowSeatDto> seatDtos = availableSeats.stream()
                .map(seat -> {

                    ShowSeatDto seatDto = new ShowSeatDto();
                    seatDto.setId(seat.getId());
                    seatDto.setStatus(seat.getStatus());
                    seatDto.setPrice(seat.getPrice());

                    SeatDto baseSeatDto = new SeatDto();
                    baseSeatDto.setId(seat.getSeat().getId());   // 🔥 FIXED
                    baseSeatDto.setSeatNumber(seat.getSeat().getSeatNumber());
                    baseSeatDto.setSeatType(seat.getSeat().getSeatType());
                    baseSeatDto.setBasePrice(seat.getSeat().getBasePrice());

                    seatDto.setSeat(baseSeatDto);

                    return seatDto;
                })
                .collect(Collectors.toList());

        showDto.setAvailableSeats(seatDtos);

        return showDto;
    }
}
