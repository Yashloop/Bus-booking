package com.busbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusSeatsResponseDTO {
    private BusResponseDTO busInfo;
    private List<SeatResponseDTO> seats;
}
