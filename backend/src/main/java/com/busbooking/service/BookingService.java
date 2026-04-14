package com.busbooking.service;

import com.busbooking.dto.BookingRequestDTO;
import com.busbooking.dto.BookingResponseDTO;
import com.busbooking.entity.Booking;
import com.busbooking.entity.Bus;
import com.busbooking.entity.Seat;
import com.busbooking.entity.User;
import com.busbooking.exception.BookingException;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.SeatRepository;
import com.busbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {
    private final BookingRepository bookingRepository;
    private final BusRepository busRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponseDTO bookTicket(BookingRequestDTO request) {
        log.info("Processing booking for userId: {}, busId: {}, seatId: {}", request.getUserId(), request.getBusId(), request.getSeatId());

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));
        
        Seat seat = seatRepository.findById(request.getSeatId())
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found"));

        if (!seat.getBus().getId().equals(bus.getId())) {
            throw new BookingException("Seat does not belong to this bus");
        }

        if (seat.getIsBooked()) {
            log.error("Seat {} already booked", seat.getSeatNumber());
            throw new BookingException("Seat already booked");
        }

        // Mark seat as booked
        seat.setIsBooked(true);
        seatRepository.save(seat);

        Booking booking = Booking.builder()
                .user(user)
                .bus(bus)
                .seat(seat)
                .bookingStatus("CONFIRMED")
                .bookingTime(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking confirmed with ID: {}", savedBooking.getId());

        return BookingResponseDTO.builder()
                .bookingId(savedBooking.getId())
                .status(savedBooking.getBookingStatus())
                .bookingTime(savedBooking.getBookingTime())
                .busName(bus.getBusName())
                .seatNumber(seat.getSeatNumber())
                .build();
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        log.info("Cancelling booking ID: {}", bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if ("CANCELLED".equals(booking.getBookingStatus())) {
            throw new BookingException("Booking is already cancelled");
        }

        // Update booking status
        booking.setBookingStatus("CANCELLED");
        bookingRepository.save(booking);

        // Make seat available again
        Seat seat = booking.getSeat();
        seat.setIsBooked(false);
        seatRepository.save(seat);
        
        log.info("Booking ID {} cancelled successfully", bookingId);
    }
}
