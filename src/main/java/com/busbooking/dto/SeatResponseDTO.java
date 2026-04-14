package com.busbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatResponseDTO {
    private Long id;
    private String seatNumber;
    private Boolean isBooked;
}
