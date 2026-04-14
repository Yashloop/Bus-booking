package com.busbooking.controller;

import com.busbooking.dto.BookingRequestDTO;
import com.busbooking.dto.BookingResponseDTO;
import com.busbooking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDTO> bookTicket(@Valid @RequestBody BookingRequestDTO request) {
        return new ResponseEntity<>(bookingService.bookTicket(request), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<java.util.List<BookingResponseDTO>> getBookingHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingHistory(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingDetails(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingDetails(id));
    }
}
