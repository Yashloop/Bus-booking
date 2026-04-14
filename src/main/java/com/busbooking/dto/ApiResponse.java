package com.busbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic success/message response wrapper.
 * Used for simple confirmations like registration success.
 * Owner: Backend-1
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {
    private String message;
}
