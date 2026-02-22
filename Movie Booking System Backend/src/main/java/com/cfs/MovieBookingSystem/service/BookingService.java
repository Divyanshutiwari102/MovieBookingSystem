package com.cfs.MovieBookingSystem.service;

import com.cfs.MovieBookingSystem.dto.*;
import com.cfs.MovieBookingSystem.exception.ResourceNotFoundException;
import com.cfs.MovieBookingSystem.exception.SeatUnavailableException;
import com.cfs.MovieBookingSystem.model.Payment;
import com.cfs.MovieBookingSystem.model.Show;
import com.cfs.MovieBookingSystem.model.ShowSeat;
import com.cfs.MovieBookingSystem.model.User;
import com.cfs.MovieBookingSystem.repository.BookingRepository;
import com.cfs.MovieBookingSystem.repository.ShowRepository;
import com.cfs.MovieBookingSystem.repository.ShowSeatRepository;
import com.cfs.MovieBookingSystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import com.cfs.MovieBookingSystem.model.*;

import java.time.LocalDate;
import java.util.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class BookingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private ShowSeatRepository showSeatRepository;

    @Autowired
    private BookingRepository bookingRepository;



    @Transactional
    public BookingDto createBooking(BookingRequestDto bookingRequest){

        User user = userRepository.findById(bookingRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

        Show show = showRepository.findById(bookingRequest.getShowId())
                .orElseThrow(() -> new ResourceNotFoundException("Show Not Found"));

        // ✅ LOCK seats at DB level
        List<ShowSeat> selectedSeats =
                showSeatRepository.findSeatsForUpdate(bookingRequest.getSeatIds());

        for(ShowSeat seat : selectedSeats){
            if(!"AVAILABLE".equals(seat.getStatus())){
                throw new SeatUnavailableException(
                        "Seat " + seat.getSeat().getSeatNumber() + " is not available"
                );
            }
            seat.setStatus("LOCKED");
        }

        showSeatRepository.saveAll(selectedSeats);

        Double totalAmount = selectedSeats.stream()
                .mapToDouble(ShowSeat::getPrice)
                .sum();


        Payment payment = new Payment();
        payment.setAmount(totalAmount);
        payment.setPaymenTime(LocalDateTime.now());
        payment.setPaymentMethod(bookingRequest.getPaymentMethod());
        payment.setStatus("SUCCESS");
        payment.setTransactionId(UUID.randomUUID().toString());


        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShow(show);
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus("CONFIRMED");
        booking.setTotalAmount(totalAmount);
        booking.setBookingNumber(UUID.randomUUID().toString());
        booking.setPayment(payment);

        Booking savedBooking = bookingRepository.save(booking);

        selectedSeats.forEach(seat -> {
            seat.setStatus("BOOKED");
            seat.setBooking(savedBooking);
        });

        showSeatRepository.saveAll(selectedSeats);

        return mapToBookingDto(savedBooking, selectedSeats);
    }



    public BookingDto getBookingById(Long id){
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking Not Found"));

        List<ShowSeat> seats =
                showSeatRepository.findByBookingId(booking.getId());

        return mapToBookingDto(booking, seats);
    }



    public BookingDto getBookingByNumber(String bookingNumber){

        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Booking Not Found"));

        List<ShowSeat> seats =
                showSeatRepository.findByBookingId(booking.getId());

        return mapToBookingDto(booking, seats);
    }



    // GET BY USER

    public List<BookingDto> getBookingByUserId(Long userId){

        List<Booking> bookings = bookingRepository.findByUserId(userId);

        return bookings.stream()
                .map(booking -> {
                    List<ShowSeat> seats =
                            showSeatRepository.findByBookingId(booking.getId());
                    return mapToBookingDto(booking, seats);
                })
                .toList();
    }



    // CANCEL BOOKING

    @Transactional
    public BookingDto cancelBooking(Long id){

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking Not Found"));

        booking.setStatus("CANCELLED");

        List<ShowSeat> seats =
                showSeatRepository.findByBookingId(booking.getId());

        seats.forEach(seat -> {
            seat.setStatus("AVAILABLE");
            seat.setBooking(null);
        });

        if(booking.getPayment() != null){
            booking.getPayment().setStatus("REFUNDED");
        }

        Booking updatedBooking = bookingRepository.save(booking);
        showSeatRepository.saveAll(seats);

        return mapToBookingDto(updatedBooking, seats);
    }



    // DTO MAPPING

    public BookingDto mapToBookingDto(Booking booking, List<ShowSeat> seats){

        BookingDto bookingDto = new BookingDto();
        bookingDto.setId(booking.getId());
        bookingDto.setBookingNumber(booking.getBookingNumber());
        bookingDto.setBookingTime(booking.getBookingTime());
        bookingDto.setStatus(booking.getStatus());
        bookingDto.setTotalAmount(booking.getTotalAmount());

        // USER
        UserDto userDto = new UserDto();
        userDto.setId(booking.getUser().getId()); // ✅ FIXED
        userDto.setName(booking.getUser().getName());
        userDto.setEmail(booking.getUser().getEmail());
        userDto.setPhoneNumber(booking.getUser().getPhoneNumber());
        bookingDto.setUser(userDto);

        // SHOW
        ShowDto showDto = new ShowDto();
        showDto.setId(booking.getShow().getId());
        showDto.setStartTime(booking.getShow().getStartTime());
        showDto.setEndTime(booking.getShow().getEndTime());

        // MOVIE
        MovieDto movieDto = new MovieDto();
        movieDto.setId(booking.getShow().getMovie().getId());
        movieDto.setTitle(booking.getShow().getMovie().getTitle());
        movieDto.setDescription(booking.getShow().getMovie().getDescription());
        movieDto.setGenre(booking.getShow().getMovie().getGenre());
        movieDto.setLanguage(booking.getShow().getMovie().getLanguage());
        movieDto.setDurationMins(booking.getShow().getMovie().getDurationMins());
        movieDto.setReleaseDate(booking.getShow().getMovie().getReleaseDate());
        movieDto.setPosterUrl(booking.getShow().getMovie().getPosterUrl());
        showDto.setMovie(movieDto);

        // SCREEN
        ScreenDto screenDto = new ScreenDto();
        screenDto.setId(booking.getShow().getScreen().getId());
        screenDto.setName(booking.getShow().getScreen().getName());
        screenDto.setTotalSeats(booking.getShow().getScreen().getTotalSeats());

        // THEATER
        TheaterDto theaterDto = new TheaterDto();
        theaterDto.setId(booking.getShow().getScreen().getTheater().getId());
        theaterDto.setName(booking.getShow().getScreen().getTheater().getName());
        theaterDto.setAddress(booking.getShow().getScreen().getTheater().getAddress());
        theaterDto.setCity(booking.getShow().getScreen().getTheater().getCity());
        theaterDto.setTotalScreens(booking.getShow().getScreen().getTheater().getTotalScreens());

        screenDto.setTheater(theaterDto);
        showDto.setScreen(screenDto);
        bookingDto.setShow(showDto);

        // SEATS
        List<ShowSeatDto> seatDtos = seats.stream()
                .map(seat -> {
                    ShowSeatDto seatDto = new ShowSeatDto();
                    seatDto.setId(seat.getId());
                    seatDto.setStatus(seat.getStatus());
                    seatDto.setPrice(seat.getPrice());

                    SeatDto baseSeatDto = new SeatDto();
                    baseSeatDto.setId(seat.getSeat().getId());
                    baseSeatDto.setSeatNumber(seat.getSeat().getSeatNumber());
                    baseSeatDto.setSeatType(seat.getSeat().getSeatType());
                    baseSeatDto.setBasePrice(seat.getSeat().getBasePrice());

                    seatDto.setSeat(baseSeatDto);
                    return seatDto;
                }).toList();

        bookingDto.setSeats(seatDtos);

        if(booking.getPayment() != null){
            PaymentDto paymentDto = new PaymentDto();
            paymentDto.setId(booking.getPayment().getId());
            paymentDto.setAmount(booking.getPayment().getAmount());
            paymentDto.setPaymentMethod(booking.getPayment().getPaymentMethod());
            paymentDto.setPaymentTime(booking.getPayment().getPaymenTime());
            paymentDto.setStatus(booking.getPayment().getStatus());
            paymentDto.setTransactionId(booking.getPayment().getTransactionId());

            bookingDto.setPayment(paymentDto);
        }

        return bookingDto;
    }
}
