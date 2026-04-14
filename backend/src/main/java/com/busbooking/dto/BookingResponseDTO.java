package com.busbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {
    private Long id;              // Maps to frontend booking.id
    private Long bookingId;       // Legacy mapping
    private String bookingStatus;  // Maps to frontend bookingStatus
    private String status;        // Legacy mapping
    private LocalDateTime bookingTime;
    private String busName;
    private String busNumber;
    private String seatNumber;
    private String source;
    private String destination;
    private LocalDate travelDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private BigDecimal fare;
}
