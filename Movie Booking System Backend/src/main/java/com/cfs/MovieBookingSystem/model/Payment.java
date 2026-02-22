package com.cfs.MovieBookingSystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String transactionId;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private LocalDateTime paymenTime;

    @Column(nullable = false)
    private String paymentMethod;

    @Column(nullable = false)
    private String status;//SUCCESS ,FAILED,PENDING

    @OneToOne(mappedBy = "payment")
    private Booking booking;
}
