package com.busbooking.service;

import com.busbooking.dto.BusResponseDTO;
import com.busbooking.dto.SeatResponseDTO;
import com.busbooking.entity.Bus;
import com.busbooking.entity.Seat;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusService {
    private final BusRepository busRepository;
    private final SeatRepository seatRepository;

    public List<BusResponseDTO> searchBuses(String source, String destination, LocalDate date) {
        // Normalize search to lowercase to match our seeded data
        List<Bus> buses = busRepository.findBySourceAndDestinationAndTravelDate(
                source.trim().toLowerCase(), 
                destination.trim().toLowerCase(), 
                date
        );
        return buses.stream()
                .map(this::mapToBusResponseDTO)
                .collect(Collectors.toList());
    }

    public List<SeatResponseDTO> getSeatsByBusId(Long busId) {
        List<Seat> seats = seatRepository.findByBusId(busId);
        return seats.stream()
                .map(seat -> SeatResponseDTO.builder()
                        .id(seat.getId())
                        .seatNumber(seat.getSeatNumber())
                        .isBooked(seat.getIsBooked())
                        .build())
                .collect(Collectors.toList());
    }

    private BusResponseDTO mapToBusResponseDTO(Bus bus) {
        return BusResponseDTO.builder()
                .id(bus.getId())
                .busName(bus.getBusName())
                .busNumber(bus.getBusNumber())
                .source(bus.getSource())
                .destination(bus.getDestination())
                .travelDate(bus.getTravelDate())
                .departureTime(bus.getDepartureTime())
                .arrivalTime(bus.getArrivalTime())
                .totalSeats(bus.getTotalSeats())
                .fare(bus.getFare())
                .build();
    }
}
