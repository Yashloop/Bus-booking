package com.busbooking.bbapp.config;

import com.busbooking.bbapp.entity.Bus;
import com.busbooking.bbapp.entity.Seat;
import com.busbooking.bbapp.entity.User;
import com.busbooking.bbapp.repository.BusRepository;
import com.busbooking.bbapp.repository.SeatRepository;
import com.busbooking.bbapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final BusRepository busRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (busRepository.count() == 0) {
            log.info("Database is empty. Initializing sample data...");

            // 1. Create a Test User
            User testUser = User.builder()
                    .name("Test User")
                    .email("test@example.com")
                    .password("password123") // In real app, this should be encoded
                    .role("USER")
                    .build();
            userRepository.save(testUser);

            // 2. Create Sample Buses
            createBus("KPN Travels", "KPN001", "Erode", "Chennai", 
                      LocalDate.now().plusDays(1), LocalTime.of(21, 0), LocalTime.of(5, 30), 650.00);
            
            createBus("SREE Travels", "SRE002", "Erode", "Chennai", 
                      LocalDate.now().plusDays(1), LocalTime.of(22, 30), LocalTime.of(6, 0), 750.00);

            createBus("VRL Travels", "VRL003", "Bangalore", "Erode", 
                      LocalDate.now().plusDays(2), LocalTime.of(23, 0), LocalTime.of(4, 0), 500.00);

            log.info("Sample data initialization complete.");
        }
    }

    private void createBus(String name, String number, String source, String dest, 
                           LocalDate date, LocalTime dep, LocalTime arr, double fare) {
        
        Bus bus = Bus.builder()
                .busName(name)
                .busNumber(number)
                .source(source)
                .destination(dest)
                .travelDate(date)
                .departureTime(dep)
                .arrivalTime(arr)
                .totalSeats(40)
                .fare(BigDecimal.valueOf(fare))
                .build();
        
        Bus savedBus = busRepository.save(bus);

        // Create 40 seats for this bus
        List<Seat> seats = new ArrayList<>();
        for (int i = 1; i <= 40; i++) {
            seats.add(Seat.builder()
                    .bus(savedBus)
                    .seatNumber("S" + i)
                    .isBooked(false)
                    .build());
        }
        seatRepository.saveAll(seats);
        log.info("Created Bus: {} with 40 seats", name);
    }
}
