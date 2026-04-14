package com.busbooking.controller;

import com.busbooking.dto.BusResponseDTO;
import com.busbooking.dto.SeatResponseDTO;
import com.busbooking.service.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/buses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For hackathon ease, usually more restrictive
public class BusController {
    private final BusService busService;

    @GetMapping("/search")
    public ResponseEntity<List<BusResponseDTO>> searchBuses(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(busService.searchBuses(source, destination, date));
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<List<SeatResponseDTO>> getSeats(@PathVariable Long id) {
        return ResponseEntity.ok(busService.getSeatsByBusId(id));
    }
}
